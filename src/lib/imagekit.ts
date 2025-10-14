import ImageKit from 'imagekit';
import sharp from 'sharp';

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
    // Convert image to WebP format for optimization
    const optimizedBuffer = await sharp(file)
      .webp({ quality: 80 })
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toBuffer();

    const uploadResponse = await imagekit.upload({
      file: optimizedBuffer,
      fileName: `${fileName}.webp`,
      folder: folder,
      useUniqueFileName: true,
      transformation: {
        pre: 'w-1920,q-80,f-webp'
      }
    });

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
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