/** @jsxImportSource react */
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Twitter,
  Users,
  Image as ImageIcon,
  Upload,
  ImagePlus,
  Cloud,
  Github,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';
import Link from 'next/link';

interface Post {
  _id: string;
  imageUrl: string;
  twitterUrl: string;
  userId: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Math.random().toString(36).substring(7));
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts);
      setStats({
        totalPosts: data.totalPosts,
        totalUsers: data.totalUsers
      });
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const bentoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <ImageIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary bg-clip-text bg-gradient-to-r from-primary to-purple-600 tracking-tight">
              Ghibli Moments
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-sm flex flex-wrap items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span>{stats.totalPosts} Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{stats.totalUsers} Users</span>
              </div>
              <a
                href="https://github.com/vegadjay"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors border-2 p-2 rounded-sm hover:bg-slate-900"
              >
                <Github className="h-[1.40rem] w-[1.40rem]" />
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <div className="relative">
            <Link href="/upload">
              <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 transition-colors group-hover:w-48 ease-in-out duration-300 flex items-center justify-center overflow-hidden"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-6 w-6 flex-shrink-0" />
                  <span className="hidden group-hover:inline-block text-sm ml-2">
                    Upload
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-muted/10 animate-pulse rounded-2xl aspect-square border-2 border-muted/30"
              >
                <div className="w-full h-full"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 mt-16 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold text-muted-foreground">
              No posts yet
            </h2>
            <p className="text-muted-foreground max-w-md">
              Be the first to share an image and start your Ghibli Moments journey!
            </p>
            <Link href="/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create First Post
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {posts.map((post) => (
              <motion.div
                key={post._id}
                variants={bentoVariants}
                className={`relative group overflow-hidden rounded-2xl aspect-square border-2 border-muted/30 transition-all duration-300 hover:border-primary/50 hover:shadow-lg`}
              >
                <a href={post.twitterUrl} target='_blank'>
                  <div className="w-full h-full">
                    <img
                      src={post.imageUrl}
                      alt="User shared image"
                      className="w-full h-full object-cover rounded-2xl group-hover:brightness-90 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white w-full justify-center">
                        <UserCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">{post.twitterUrl}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}