import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Schedule } from '@/lib/models';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const scheduleItem = await Schedule.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!scheduleItem) {
      return NextResponse.json(
        { error: 'Schedule item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(scheduleItem);
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule item' },
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
    
    const scheduleItem = await Schedule.findByIdAndDelete(params.id);
    
    if (!scheduleItem) {
      return NextResponse.json(
        { error: 'Schedule item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Schedule item deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule item' },
      { status: 500 }
    );
  }
}