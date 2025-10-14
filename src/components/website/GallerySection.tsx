'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="gallery" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Gallery
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {images.map((image) => (
          <motion.div
            key={image._id}
            variants={imageVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-base font-medium">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 cursor-pointer right-4 z-10 bg-black/50 text-white hover:bg-black/70 hover:text-white scale-105"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6 cursor-pointer hover:text-white scale-105" />
              </Button>
              <div className="relative">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                {selectedImage.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-center">{selectedImage.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}