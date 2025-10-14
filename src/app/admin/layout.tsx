import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - ETHNOSPARK 2025",
  description: "Manage your event content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}