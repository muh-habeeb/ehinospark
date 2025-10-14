import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { GalleryImage } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const images = await GalleryImage.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const image = new GalleryImage({
      ...data,
      isActive: true,
      order: data.order || 0
    });
    
    await image.save();
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}