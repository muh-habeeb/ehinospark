'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export default function TeamSection({ members }: TeamSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const memberVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="team" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Organizing Committee
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {members.map((member) => (
            <motion.div
              key={member._id}
              variants={memberVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {member.name}
              </h3>
              <p className="text-purple-600 font-medium mb-3">{member.role}</p>
              {member.bio && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}