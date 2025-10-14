import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { Program } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const programs = await Program.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const program = new Program({
      ...data,
      isActive: true,
      order: data.order || 0
    });
    
    await program.save();
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}