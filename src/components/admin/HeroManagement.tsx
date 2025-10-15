'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Trash2, Plus, Image as ImageIcon, Loader, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface HeroData {
  _id?: string;
  title: string;
  subtitle: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

export default function HeroManagement() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    subtitle: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        // API returns a single object, not an array
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Failed to load hero data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = heroData._id ? 'PUT' : 'POST';
      const url = '/api/hero'; // Use same endpoint for both POST and PUT
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        const savedData = await response.json();
        setHeroData(savedData);
        toast.success('Hero section updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save hero data');
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save hero data');
    } finally {
      setIsSaving(false);
    }
  };

  const addImage = () => {
    if (newImageUrl && newImageAlt) {
      setHeroData(prev => ({
        ...prev,
        images: [...prev.images, { url: newImageUrl, alt: newImageAlt }]
      }));
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

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
    if (!selectedFile || !newImageAlt) {
      toast.error('Please select an image and provide alt text');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'ethnospark/hero');

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
      
      // Add the uploaded image to hero data
      setHeroData(prev => ({
        ...prev,
        images: [...prev.images, { url: result.url, alt: newImageAlt }]
      }));

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setNewImageAlt('');
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

  const removeImage = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
       <Loader className='size-16 animate-spin text-blue-600'/>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ImageIcon className="h-5 w-5" />
            Hero Section Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage the main hero section content and images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Hero Title</Label>
            <Input
              id="title"
              value={heroData.title}
              onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter hero title"
              className="text-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Subtitle Input */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-gray-300">Hero Subtitle</Label>
            <Textarea
              id="subtitle"
              value={heroData.subtitle}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Enter hero subtitle/description"
              rows={3}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <Label className="text-gray-300">Hero Images</Label>
            
            {/* Upload New Image */}
            <Card className="border-dashed border-2 border-gray-600 bg-gray-700/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
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
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>

                    {/* File Preview */}
                    {selectedFile && previewUrl && (
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
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Alt Text for Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="uploadImageAlt" className="text-gray-300">Alt Text for Uploaded Image</Label>
                      <Input
                        id="uploadImageAlt"
                        value={newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                        placeholder="Describe the image for accessibility"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    {/* Upload Button */}
                    <Button
                      onClick={uploadImage}
                      disabled={!selectedFile || !newImageAlt || isUploading}
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

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-700 px-2 text-gray-400">Or add by URL</span>
                    </div>
                  </div>

                  {/* Add by URL Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-gray-300">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageAlt" className="text-gray-300">Alt Text</Label>
                      <Input
                        id="imageAlt"
                        value={newImageUrl ? '' : newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                        placeholder="Describe the image"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        disabled={!!selectedFile}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addImage}
                    disabled={!newImageUrl || !newImageAlt}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image by URL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Images */}
            {heroData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="aspect-video relative mb-3 overflow-hidden rounded-lg bg-gray-700">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{image.alt}</p>
                        <Button
                          onClick={() => removeImage(index)}
                          variant="destructive"
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="min-w-32">
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}