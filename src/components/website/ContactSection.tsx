'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Mail, Phone, Github } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa6";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact Us</h2>

          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl"
            >
              🎉 Cultural Committee - The Yenepoya College
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>ethnospark@college.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+91 9656 80 5212</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center items-center gap-6 pt-4"
            >
              <span className="text-lg">Follow us on:</span>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.instagram.com/tm.blazeyenz/?__pwa=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://github.com/muh-habeeb/"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://youtube.com/@coding_with_mayavi0"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Youtube className="w-6 h-6" />
                </motion.a>
              </div>
            </motion.div>

          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 text-xl text-white/70 ring-0 ">
            Send Photos {'>'} to Update Gallery
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="https://shorturl.at/HUYU1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full "
            > <FaWhatsapp className=" rounded-full inline-block size-8 mb-1 ml-1 hover:scale-110 transition-all " /></motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
