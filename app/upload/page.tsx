"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const extractTwitterHandle = (url: string): string => {
    try {
      // Create a URL object
      const parsedUrl = new URL(url);

      // Get the pathname and remove leading slash
      const pathname = parsedUrl.pathname.substring(1);

      // Return handle with @ symbol
      return `@${pathname}`;
    } catch (error) {
      // If URL is invalid, return the input as is
      return url.startsWith('@') ? url : `@${url}`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('File size should be less than 4MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    // Extract and format Twitter handle
    const formattedTwitterHandle = extractTwitterHandle(twitterHandle);

    try {
      setIsUploading(true);
      const userId = localStorage.getItem('userId') || Math.random().toString(36).substring(7);
      localStorage.setItem('userId', userId);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('twitterHandle', formattedTwitterHandle);
      formData.append('userId', userId);

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      toast.success('Post created successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
      setTwitterHandle('');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Link>

        <Card className="max-w-2xl mx-auto rounded-2xl overflow-hidden">
          <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-6">Share Your Content</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Image
                  </label>
                  <div className="mt-2">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <div className="mt-4">
                          <Button type="button" variant="secondary">
                            Select Image
                          </Button>
                          <p className="mt-2 text-sm text-muted-foreground">
                            PNG, JPG up to 4MB
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="twitterHandle" className="block text-sm font-medium mb-2">
                    Twitter URL or Handle
                  </label>
                  <Input
                    id="twitterHandle"
                    type="text"
                    placeholder="https://x.com/username or @username"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl"
                size="lg"
                disabled={!selectedFile || !twitterHandle || isUploading}
              >
                <Upload className="mr-2 h-5 w-5" />
                {isUploading ? 'Uploading...' : 'Share Post'}
              </Button>
            </form>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}