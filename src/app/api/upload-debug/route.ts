import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload Debug Info ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Content-Type:', request.headers.get('content-type'));
    console.log('Content-Length:', request.headers.get('content-length'));
    
    // Try to parse form data
    let formDataInfo: string | {
      hasFile: boolean;
      fileName: string;
      fileSize: number;
      fileType: string;
      folder: string;
    } = 'Could not parse form data';
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const folder = formData.get('folder') as string;
      
      formDataInfo = {
        hasFile: !!file,
        fileName: file?.name || 'N/A',
        fileSize: file?.size || 0,
        fileType: file?.type || 'N/A',
        folder: folder || 'N/A'
      };
      
      console.log('Form data info:', formDataInfo);
    } catch (error) {
      console.error('Form data parsing error:', error);
      formDataInfo = `Error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }

    // Check environment variables
    const envCheck = {
      IMAGEKIT_PUBLIC_KEY: !!process.env.IMAGEKIT_PUBLIC_KEY,
      IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
      IMAGEKIT_URL_ENDPOINT: !!process.env.IMAGEKIT_URL_ENDPOINT,
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log('Environment check:', envCheck);
    console.log('=== End Debug Info ===');

    return NextResponse.json({
      success: true,
      message: 'Debug info logged to console',
      formData: formDataInfo,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}