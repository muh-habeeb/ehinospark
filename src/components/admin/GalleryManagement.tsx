'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save, Trash2, Plus, Edit, Images, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import ImageUpload from '@/components/ui/image-upload';

interface GalleryImage {
    _id?: string;
    url: string;
    alt: string;
    caption?: string;
    order?: number;
}

export default function GalleryManagement() {
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const emptyImage: GalleryImage = {
        url: '',
        alt: '',
        caption: '',
        order: 0
    };

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    // Filter images based on search term with memoization
    const filteredImages = useMemo(() => {
        if (!searchTerm.trim()) return galleryImages;
        
        const searchLower = searchTerm.toLowerCase();
        return galleryImages.filter(image =>
            image.alt.toLowerCase().includes(searchLower) ||
            (image.caption && image.caption.toLowerCase().includes(searchLower))
        );
    }, [galleryImages, searchTerm]);

    const fetchGalleryImages = async () => {
        try {
            const response = await fetch('/api/gallery');
            if (response.ok) {
                const data = await response.json();
                setGalleryImages(data);
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            toast.error('Failed to load gallery images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingImage || !editingImage.url || !editingImage.alt) {
            toast.error('Please fill in required fields (URL and alt text)');
            return;
        }

        setIsSaving(true);
        try {
            const method = editingImage._id ? 'PUT' : 'POST';
            const url = editingImage._id ? `/api/gallery/${editingImage._id}` : '/api/gallery';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingImage),
            });

            if (response.ok) {
                const savedImage = await response.json();

                if (editingImage._id) {
                    setGalleryImages(prev => prev.map(img => img._id === savedImage._id ? savedImage : img));
                } else {
                    setGalleryImages(prev => [...prev, savedImage]);
                }

                setIsDialogOpen(false);
                setEditingImage(null);
                toast.success(editingImage._id ? 'Gallery image updated successfully!' : 'Gallery image added successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save gallery image');
            }
        } catch (error) {
            console.error('Error saving gallery image:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save gallery image');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGalleryImages(prev => prev.filter(img => img._id !== imageId));
                toast.success('Gallery image deleted successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete gallery image');
            }
        } catch (error) {
            console.error('Error deleting gallery image:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete gallery image');
        }
    };

    const openDialog = (image?: GalleryImage) => {
        setEditingImage(image ? { ...image } : { ...emptyImage });
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-48 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <div className="aspect-square bg-gray-700 animate-pulse"></div>
                            <div className="p-3 space-y-2">
                                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-3 w-1/2 bg-gray-800 rounded animate-pulse"></div>
                                <div className="flex gap-2">
                                    <div className="h-8 flex-1 bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-8 flex-1 bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Images className="h-6 w-6" />
                        Gallery Management
                    </h2>
                    <p className="text-gray-400">Manage event photos and gallery images</p>
                </div>
                <div className="flex gap-3 items-center">
                    <Input
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button onClick={() => openDialog()} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                    </Button>
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-400 mb-4">
                Showing {filteredImages.length} of {galleryImages.length} images
                {searchTerm && ` matching "${searchTerm}"`}
            </div>

            {/* Empty state */}
            {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                    <Images className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                        {searchTerm ? 'No images found' : 'No images uploaded yet'}
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm 
                            ? 'Try adjusting your search terms'
                            : 'Add your first image to get started'
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => openDialog()} className="mt-4 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Image
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* Optimized Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image, index) => (
                        <motion.div
                            key={image._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                                duration: 0.2,
                                delay: Math.min(index * 0.05, 0.3),
                                ease: "easeOut"
                            }}
                            style={{ willChange: 'transform, opacity' }}
                            className="group"
                        >
                            <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full hover:border-gray-600 transition-colors duration-200">
                                <CardContent className="p-0">
                                    <div className="aspect-square relative overflow-hidden bg-gray-700">
                                        {failedImages.has(image._id || '') ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="h-16 w-16 text-gray-500" />
                                            </div>
                                        ) : (
                                            <>
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt}
                                                    fill
                                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                    unoptimized={true}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                    priority={index < 4}
                                                    loading={index < 4 ? "eager" : "lazy"}
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX//2Q=="
                                                    onError={() => {
                                                        console.error('Image failed to load:', image.url);
                                                        setFailedImages(prev => new Set([...prev, image._id || '']));
                                                    }}
                                                />
                                                {/* Loading placeholder */}
                                                <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center opacity-0 transition-opacity duration-200" 
                                                     style={{
                                                         opacity: failedImages.has(image._id || '') ? 0 : undefined
                                                     }}>
                                                    <div className="w-8 h-8 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin" />
                                                </div>
                                            </>
                                        )}

                                        {/* Order badge */}
                                        {image.order !== undefined && image.order > 0 && (
                                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                #{image.order}
                                            </div>
                                        )}

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-medium text-white mb-1 truncate text-sm">{image.alt}</h3>
                                        {image.caption && (
                                            <p className="text-gray-400 text-xs mb-2 line-clamp-2">{image.caption}</p>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => openDialog(image)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-gray-600  hover:text-gray-200 hover:bg-gray-700 text-xs h-8 cursor-pointer"
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(image._id!)}
                                                variant="destructive"
                                                size="sm"
                                                className="flex-1 text-xs h-8 cursor-pointer hover:bg-red-700 hover:text-white"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            </>
            )}

            {/* Add/Edit Image Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingImage?._id ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {editingImage?._id ? 'Update image details' : 'Add a new image to the gallery'}
                        </DialogDescription>
                    </DialogHeader>

                    {editingImage && (
                        <div className="space-y-4">
                            <ImageUpload
                                currentImageUrl={editingImage.url}
                                onImageUploaded={(url) => setEditingImage(prev => prev ? { ...prev, url } : null)}
                                folder="ethnospark/gallery"
                                label="Gallery Image"
                                placeholder="https://example.com/image.jpg"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="alt" className="text-gray-300">Alt Text *</Label>
                                    <Input
                                        id="alt"
                                        value={editingImage.alt}
                                        onChange={(e) => setEditingImage(prev => prev ? { ...prev, alt: e.target.value } : null)}
                                        placeholder="Describe the image"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={editingImage.order || 0}
                                        onChange={(e) => setEditingImage(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                                        placeholder="0"
                                        min="0"
                                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="caption" className="text-gray-300">Caption (Optional)</Label>
                                <Textarea
                                    id="caption"
                                    value={editingImage.caption || ''}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingImage(prev => prev ? { ...prev, caption: e.target.value } : null)}
                                    placeholder="Add a caption for this image"
                                    rows={3}
                                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSaving}
                            className="border-gray-600 hover:text-gray-300 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editingImage?._id ? 'Update' : 'Add Image'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}