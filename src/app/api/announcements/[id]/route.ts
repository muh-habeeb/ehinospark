import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Announcement } from '@/lib/models';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const announcement = await Announcement.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
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
    
    const announcement = await Announcement.findByIdAndDelete(params.id);
    
    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}