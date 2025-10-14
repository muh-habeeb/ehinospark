import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Poppins } from 'next/font/google';
const inter = Inter({
  subsets: ["latin"],
});
// app/layout.js
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Recommended for better font loading
  variable: '--font-poppins', // Define a CSS variable for easy access
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify desired weights
});
export const metadata: Metadata = {
  title: "ETHNOSPARK 2025 - College Ethnic Day",
  description: "Celebrating Culture, Unity & Diversity at our College Ethnic Day event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
        <SpeedInsights />

        <Toaster />
      </body>
    </html>
  );
}
