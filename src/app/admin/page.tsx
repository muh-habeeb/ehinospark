"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Images,
  UserCircle,
  MessageSquare,
  LogOut,
  Star,
  TrendingUp,
  Eye,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import admin management components
import HeroManagement from "@/components/admin/HeroManagement";
import ProgramsManagement from "@/components/admin/ProgramsManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import ScheduleManagement from "@/components/admin/ScheduleManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";
import AnnouncementsManagement from "@/components/admin/AnnouncementsManagement";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    schedules: 0,
    galleryImages: 0,
    teamMembers: 0,
    announcements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          programsRes,
          schedulesRes,
          galleryRes,
          teamRes,
          announcementsRes,
        ] = await Promise.all([
          fetch("/api/programs"),
          fetch("/api/schedule"),
          fetch("/api/gallery"),
          fetch("/api/team"),
          fetch("/api/announcements"),
        ]);

        const [programs, schedules, gallery, team, announcements] =
          await Promise.all([
            programsRes.json(),
            schedulesRes.json(),
            galleryRes.json(),
            teamRes.json(),
            announcementsRes.json(),
          ]);

        setStats({
          programs: programs.length || 0,
          schedules: schedules.length || 0,
          galleryImages: gallery.length || 0,
          teamMembers: team.length || 0,
          announcements: announcements.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch {
      toast.error("Error logging out");
    }
  };

  // Navigation functions for quick actions
  const navigateToTab = (tabValue: string) => {
    setActiveTab(tabValue);
    // Add smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Add toast feedback
    const tabNames: Record<string, string> = {
      hero: "Hero Section",
      programs: "Programs",
      schedule: "Schedule",
      team: "Team Management",
      gallery: "Gallery",
      announcements: "Announcements",
    };
    toast.success(`Navigated to ${tabNames[tabValue]}`);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <motion.div>
      <Card className="hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-300 truncate pr-2">
            {title}
          </CardTitle>
          <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${color} flex-shrink-0`} />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-white">
            {value}
          </div>
          <p className="text-xs text-gray-400 mt-1">Total items</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className=" bg-black min-h-screen flex items-center justify-center">
        <Loader className="size-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Mobile Responsive */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                ETHNOSPARK Admin
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => window.open("/", "_blank")}
                className="text-xs sm:text-sm border-gray-600 hover:text-gray-300 hover:bg-gray-700 px-2 sm:px-3 cursor-pointer"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">Site</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-xs sm:text-sm text-red-400 border-red-600 hover:bg-red-600 hover:text-white px-2 sm:px-3 cursor-pointer"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Overview - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Manage your ETHNOSPARK event content
          </p>
        </div>

        {/* Stats Grid - Improved Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Programs"
            value={stats.programs}
            icon={Star}
            color="text-blue-400"
          />
          <StatCard
            title="Schedule Events"
            value={stats.schedules}
            icon={Calendar}
            color="text-green-400"
          />
          <StatCard
            title="Gallery Images"
            value={stats.galleryImages}
            icon={Images}
            color="text-purple-400"
          />
          <StatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={Users}
            color="text-orange-400"
          />
          <StatCard
            title="Announcements"
            value={stats.announcements}
            icon={MessageSquare}
            color="text-pink-400"
          />
        </div>

        {/* Management Tabs - Mobile Responsive */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <div className="w-full bg-gray-800 border border-gray-700 rounded-md p-3">
            <div className="flex flex-wrap w-full gap-2 justify-center items-center">
              <button
                onClick={() => setActiveTab("overview")}
                className={`cursor-pointer text-xs sm:text-sm whitespace-nowrap px-3 py-2 flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "overview"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden text-xs">Home</span>
              </button>
              <button
                onClick={() => setActiveTab("hero")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "hero"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Hero</span>
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "programs"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Programs</span>
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "schedule"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Schedule</span>
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "gallery"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <Images className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "team"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <UserCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Team</span>
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 cursor-pointer flex-shrink-0 rounded-sm hover:bg-gray-700/50 transition-colors inline-flex items-center ${
                  activeTab === "announcements"
                    ? "bg-gray-700 text-white"
                    : "text-gray-300"
                }`}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Announcements</span>
                <span className="sm:hidden text-xs">News</span>
              </button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("hero")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-blue-600 hover:border-blue-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Update Hero Section
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("programs")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-purple-600 hover:border-purple-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Add New Program
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("schedule")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-green-600 hover:border-green-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Schedule Event
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("team")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-orange-600 hover:border-orange-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Manage Team Members
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("gallery")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-pink-600 hover:border-pink-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <Images className="w-4 h-4 mr-2" />
                    Upload Gallery Images
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigateToTab("announcements")}
                    className="w-full justify-start bg-gray-700 text-white hover:bg-teal-600 hover:border-teal-500 border-gray-600 transition-all duration-200"
                    variant="outline"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Post Announcement
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents will be added in subsequent components */}
          <TabsContent value="hero">
            <HeroManagement />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsManagement />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
