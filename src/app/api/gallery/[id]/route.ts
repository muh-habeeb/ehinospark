import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { GalleryImage } from '@/lib/models';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const image = await GalleryImage.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!image) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const image = await GalleryImage.findByIdAndDelete(params.id);
    
    if (!image) {
      return NextResponse.json(
        { error: 'Gallery image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}