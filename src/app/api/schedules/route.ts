import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Schedule } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const schedules = await Schedule.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}