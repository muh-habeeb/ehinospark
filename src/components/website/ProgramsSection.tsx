'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface Program {
  _id: string;
  name: string;
  description: string;
  image: string;
  time?: string;
  location?: string;
}

interface ProgramsSectionProps {
  programs: Program[];
}

export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="programs" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Programs
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {programs.map((program) => (
          <motion.div
            key={program._id}
            variants={cardVariants}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative overflow-hidden h-48">
              <Image
                src={program.image}
                alt={program.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {program.name}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-3">
                {program.description}
              </p>
              {program.time && (
                <div className="text-sm text-purple-600 font-medium">
                  ⏰ {program.time}
                </div>
              )}
              {program.location && (
                <div className="text-sm text-gray-500 mt-1 flex">
                  <MapPin size={20}/> {program.location}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}