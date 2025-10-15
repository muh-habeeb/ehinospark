"use client";

interface AnnouncementProps {
  announcements: { text: string; _id: string }[];
}

export default function AnnouncementMarquee({
  announcements,
}: AnnouncementProps) {
  if (!announcements.length) return null;

  // Create a continuous string of all announcements with gaps
  const marqueeContent = announcements
    .map((announcement) => announcement.text)
    .join("  |   ");

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 overflow-hidden relative mt-16 hover-pause-marquee">
      <div className="flex items-center">
        <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold mr-4 flex-shrink-0 z-10 relative animate-pulse hidden sm:inline-block">
          📢 ANNOUNCEMENTS
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-text">
              {marqueeContent}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-text {
          display: inline-block;
          animation: marquee 60s linear infinite;
          font-size: 1.125rem;
          font-weight: 500;
        }
        @media screen and (max-width: 640px) {
          .marquee-text {
            animation: marquee 80s linear infinite;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }

        /* Pause animation on hover */
        .hover-pause-marquee:hover .marquee-text {
          animation-play-state: paused;
        }

        .hover-pause-marquee .marquee-text {
          animation-play-state: running;
        }

        @keyframes marquee {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
