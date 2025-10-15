import ImageKit from 'imagekit';

// Helper function to dynamically import sharp
async function getSharp() {
  // Check if Sharp is disabled via environment variable
  if (process.env.DISABLE_SHARP === 'true') {
    console.log('Sharp disabled via DISABLE_SHARP environment variable');
    return null;
  }
  
  try {
    const sharpModule = await import('sharp');
    return sharpModule.default;
  } catch {
    console.warn('Sharp not available - continuing without image optimization');
    return null;
  }
}

// Validate environment variables
const requiredEnvVars = {
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
});

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
}

export const uploadImage = async (
  file: Buffer,
  fileName: string,
  folder: string = 'ethnospark'
): Promise<UploadResult> => {
  try {
    console.log(`Starting image upload: ${fileName} to folder: ${folder}`);
    
    // Try to optimize image with Sharp if available
    let optimizedBuffer = file;
    const sharp = await getSharp();
    
    if (sharp) {
      try {
        console.log('Optimizing image with Sharp...');
        optimizedBuffer = await sharp(file)
          .webp({ quality: 80 })
          .resize(1920, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .toBuffer();
        console.log(`Image optimized: ${optimizedBuffer.length} bytes`);
      } catch (sharpError) {
        console.warn('Sharp optimization failed, using original file:', sharpError);
        optimizedBuffer = file;
      }
    } else {
      console.log('Sharp not available - uploading original file');
    }

    const uploadResponse = await imagekit.upload({
      file: optimizedBuffer,
      fileName: sharp ? `${fileName}.webp` : fileName,
      folder: folder,
      useUniqueFileName: true,
      ...(sharp && {
        transformation: {
          pre: 'w-1920,q-80,f-webp'
        }
      })
    });

    console.log(`Upload successful: ${uploadResponse.url}`);

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name
    };
  } catch (error) {
    console.error('ImageKit upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fileName,
      folder,
      timestamp: new Date().toISOString()
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'ImageKit authentication failed - check API keys';
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Invalid image file or upload parameters';
      } else if (error.message.includes('413') || error.message.includes('too large')) {
        errorMessage = 'Image file is too large';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteImage = async (fileId: string): Promise<boolean> => {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return false;
  }
};

export const getImageUrl = (filePath: string, transformations?: Record<string, string>): string => {
  if (process.env.NODE_ENV === 'development') {
    // In development, return local path
    return filePath.startsWith('/') ? filePath : `/${filePath}`;
  }
  
  return imagekit.url({
    path: filePath,
    transformation: transformations ? Object.entries(transformations).map(([key, value]) => ({ [key]: value })) : undefined
  });
};

export default imagekit;