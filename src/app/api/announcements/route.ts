import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Announcement } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const announcement = new Announcement({
      ...data,
      isActive: true
    });
    
    await announcement.save();
    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
