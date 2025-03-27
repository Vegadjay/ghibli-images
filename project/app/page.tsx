"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  useEffect(() => {
    fetchPosts();
    // Generate a random user ID if not exists
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Math.random().toString(36).substring(7));
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts);
      setStats({
        totalPosts: data.totalPosts,
        totalUsers: data.totalUsers
      });
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Social Grid</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="mr-4">Posts: {stats.totalPosts}</span>
              <span>Users: {stats.totalUsers}</span>
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
          className="fixed bottom-8 right-8 z-50"
        >
          <Link href="/upload">
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <motion.div
              key={post._id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden rounded-2xl transform transition-all duration-300 hover:shadow-xl">
                <motion.img
                  src={post.imageUrl}
                  alt="User shared image"
                  className="w-full h-48 object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <a
                    href={post.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    View on Twitter
                  </a>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}