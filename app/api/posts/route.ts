import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Add this export to explicitly make the route dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const twitterUrl = formData.get('twitterUrl') as string | null;
    const userId = formData.get('userId') as string | null;

    // Validate inputs
    if (!file || !twitterUrl || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db("socialgrid");

    // Check existing posts
    const existingPosts = await db.collection("posts").find({ userId }).toArray();
    if (existingPosts.length >= 2) {
      return NextResponse.json(
        { error: "Maximum 2 posts per user allowed" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Prepare post document
    const post = {
      imageUrl: base64Image,
      twitterUrl,
      userId,
      createdAt: new Date(),
    };

    // Insert post
    await db.collection("posts").insertOne(post);

    return NextResponse.json({ message: "Post created successfully" });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to create post", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("socialgrid");

    const posts = await db.collection("posts").find().toArray();
    const totalPosts = await db.collection("posts").countDocuments();
    const totalUsers = (await db.collection("posts").distinct("userId")).length;

    return NextResponse.json({ posts, totalPosts, totalUsers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}