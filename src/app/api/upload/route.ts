import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/imagekit';

export async function GET() {
  return NextResponse.json(
    { 
      error: 'This endpoint only accepts POST requests for file uploads',
      allowedMethods: ['POST']
    },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'ethnospark';
    
    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Upload error: Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('Upload error: File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename from original file name
    const fileName = file.name.split('.')[0] || 'image';

    // Upload to ImageKit
    const uploadResult = await uploadImage(buffer, fileName, folder);
    console.log(uploadResult)
    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      name: uploadResult.name
    });

  } catch (error) {
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}