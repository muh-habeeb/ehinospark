import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Schedule } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const scheduleItems = await Schedule.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(scheduleItems);
  } catch (error) {
    console.error('Error fetching schedule items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const scheduleItem = new Schedule({
      ...data,
      isActive: true,
      order: data.order || 0
    });
    
    await scheduleItem.save();
    return NextResponse.json(scheduleItem);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule item' },
      { status: 500 }
    );
  }
}