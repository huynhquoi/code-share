"use client";

import { Link } from "@/i18n/routing";
import { Code2 } from "lucide-react";
// import { useTranslations } from "next-intl";

export function NavBar() {
  // const t = useTranslations("nav");
  return (
    <nav className="border-b bg-background sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="w-6 h-6" />
            <span className="hidden sm:inline">CodeS</span>
            <span className="sm:hidden">CS</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
