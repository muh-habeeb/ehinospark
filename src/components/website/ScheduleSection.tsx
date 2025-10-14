'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface ScheduleEvent {
  _id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface ScheduleSectionProps {
  schedules: ScheduleEvent[];
}

export default function ScheduleSection({ schedules }: ScheduleSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const eventVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="schedule" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
             Event Schedule
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">Experience the cultural journey throughout the day</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {schedules.map((event, index) => (
            <motion.div
              key={event._id}
              variants={eventVariants}
              className="group h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 hover:border-purple-200 relative overflow-hidden h-80 flex flex-col">
                {/* Background gradient decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                {/* Time badge */}
                <div className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg w-fit">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {event.time}
                </div>
                
                {/* Event number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-purple-200 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-blue-700 mb-3 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-800 transition-colors duration-300 flex-grow">
                  {event.description}
                </p>
                
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg group-hover:bg-purple-100 transition-colors duration-300 mt-auto">
                    <span className="text-base flex"><MapPin size={20}/></span>
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}