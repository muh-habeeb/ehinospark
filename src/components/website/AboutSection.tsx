'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          About ETHNOSPARK
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-8"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          <span className="font-bold text-blue-600">ETHNOSPARK</span> is our college&apos;s grand cultural celebration where tradition meets creativity.
          The event showcases diverse cultural performances, traditional fashion, art, and music,
          bringing together students to celebrate India&apos;s rich heritage.
        </p>
      </motion.div>
    </section>
  );
}