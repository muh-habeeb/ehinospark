import { Globe, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">
          © 2025 ETHNOSPARK | All Rights Reserved | Designed by BCA Students
        </p>
        <p
          className="text-xs mt-2 flex
          justify-center items-center gap-1"
        >
          Developed with ❤️ |{"   "}
          <Link
            className="underline inline-block text-red-500 hover:scale-110 "
            href="https://muh-habeeb.vercel.app"
          >
            <Globe />
          </Link>
        </p>
      </div>
    </footer>
  );
}
