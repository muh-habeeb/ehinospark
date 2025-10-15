'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/website/Navbar';
import AnnouncementMarquee from '@/components/website/AnnouncementMarquee';
import HeroSection from '@/components/website/HeroSection';
import AboutSection from '@/components/website/AboutSection';
import ProgramsSection from '@/components/website/ProgramsSection';
import ScheduleSection from '@/components/website/ScheduleSection';
import GallerySection from '@/components/website/GallerySection';
import TeamSection from '@/components/website/TeamSection';
import ContactSection from '@/components/website/ContactSection';
import Footer from '@/components/website/Footer';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroData {
  title: string;
  subtitle: string;
  images: { url: string; alt: string }[];
}

interface Program {
  _id: string;
  name: string;
  description: string;
  image: string;
  time?: string;
  location?: string;
}

interface Schedule {
  _id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

interface Announcement {
  _id: string;
  text: string;
}

export default function Home() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'ETHNOSPARK 2025',
    subtitle: 'College Ethnic Day – Celebrating Culture, Unity & Diversity',
    images: [{
      url: 'https://images.unsplash.com/photo-1617066783456-65a5eeb48950',
      alt: 'Hero Image'
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes,announcementsRes, programsRes, schedulesRes, galleryRes, teamRes ] = await Promise.all([
          fetch('/api/hero'),
          fetch('/api/announcements'),
          fetch('/api/programs'),
          fetch('/api/schedules'),
          fetch('/api/gallery'),
          fetch('/api/team'),
        ]);

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          setHeroData(heroData);
        }

        if (programsRes.ok) {
          const programsData = await programsRes.json();
          setPrograms(programsData);
        }

        if (schedulesRes.ok) {
          const schedulesData = await schedulesRes.json();
          setSchedules(schedulesData);
        }

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(galleryData);
        }

        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeamMembers(teamData);
        }

        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          setAnnouncements(announcementsData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center flex flex-col items-center">
          <Loader className='size-16 animate-spin text-blue-600' />
          <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0 }}
          >
            <p className="text-xl font-semibold text-blue-600 capitalize">Hang on a second... <br /> we&apos;ll get things ready for you!</p> 
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 select-none">
      <Navbar />
      {announcements.length > 0 && <AnnouncementMarquee announcements={announcements} />}
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        images={heroData.images}
      />
      <AboutSection />
      <ProgramsSection programs={programs} />
      <ScheduleSection schedules={schedules} />
      <GallerySection images={galleryImages} />
      <TeamSection members={teamMembers} />
      <ContactSection />
      <Footer />
    </div>
  );
}