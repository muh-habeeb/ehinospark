'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Trash2, Plus, Image as ImageIcon, Loader } from 'lucide-react';
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
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

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
            
            {/* Add New Image */}
            <Card className="border-dashed border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageAlt">Alt Text</Label>
                    <Input
                      id="imageAlt"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="Describe the image"
                    />
                  </div>
                </div>
                <Button onClick={addImage} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>

            {/* Existing Images */}
            {heroData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-video relative mb-2 overflow-hidden rounded-lg">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{image.alt}</p>
                        <Button
                          onClick={() => removeImage(index)}
                          variant="destructive"
                          size="sm"
                          className="w-full"
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