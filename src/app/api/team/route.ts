import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { TeamMember } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const member = new TeamMember({
      ...data,
      isActive: true,
      order: data.order || 0
    });
    
    await member.save();
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}