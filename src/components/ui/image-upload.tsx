'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  onImageUploaded,
  currentImageUrl = '',
  folder = 'ethnospark',
  label = 'Image',
  placeholder = 'Enter image URL or upload file',
  className = ''
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update imageUrl when currentImageUrl changes (for editing scenarios)
  useEffect(() => {
    setImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text or default message
          errorMessage = response.statusText || `Upload failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }
      
      // Update the image URL and notify parent
      setImageUrl(result.url);
      onImageUploaded(result.url);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-gray-300">{label}</Label>
      
      {/* File Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <div
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-600/20 scale-105'
                : 'border-gray-500 bg-gray-600 hover:bg-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-3 transition-colors ${
                isDragOver ? 'text-blue-400' : 'text-gray-300'
              }`} />
              <p className={`mb-2 text-sm transition-colors ${
                isDragOver ? 'text-blue-300' : 'text-gray-300'
              }`}>
                {isDragOver ? (
                  <span className="font-semibold">Drop image here</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className={`text-xs transition-colors ${
                isDragOver ? 'text-blue-400' : 'text-gray-400'
              }`}>
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </div>
        </div>

        {/* Image Preview Section - Only show one preview at a time */}
        {selectedFile && previewUrl ? (
          /* File Preview */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Selected: {selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelFileSelection}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800 max-h-48">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Upload Button */}
            <Button
              onClick={uploadImage}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        ) : imageUrl ? (
          /* Current Image Preview */
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Current Image:</div>
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800 max-h-48">
              <Image
                src={imageUrl}
                alt="Current image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-800 px-2 text-gray-400">Or enter URL</span>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Input
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            disabled={!!selectedFile}
          />
        </div>
      </div>
    </div>
  );
}