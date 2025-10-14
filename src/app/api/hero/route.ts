import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import { HeroSection } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const heroSection = await HeroSection.findOne({ isActive: true }) || await HeroSection.create({
      title: 'ETHNOSPARK 2025',
      subtitle: 'College Ethnic Day – Celebrating Culture, Unity & Diversity',
      images: [{
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        alt: 'Hero Image'
      }],
      isActive: true
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Deactivate any existing active hero sections
    await HeroSection.updateMany({ isActive: true }, { isActive: false });

    // Create new hero section
    const heroSection = await HeroSection.create({
      ...data,
      isActive: true
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error creating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to create hero section' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Update the active hero section
    const heroSection = await HeroSection.findOneAndUpdate(
      { isActive: true },
      { ...data, isActive: true },
      { new: true, upsert: true }
    );

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}