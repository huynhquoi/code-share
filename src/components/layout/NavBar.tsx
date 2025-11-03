"use client";

import { Link } from "@/i18n/routing";
import { Code2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" },
  { href: "/tags", label: "Tags" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/70 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Code2 className="w-6 h-6" />
          <span className="hidden sm:inline">CodeS</span>
          <span className="sm:hidden">CS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <UserMenu />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <MobileSheet pathname={pathname} />
        </div>
      </div>
    </nav>
  );
}

function MobileSheet({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 flex flex-col">
        <SheetHeader className="pb-2 border-b">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col m-2 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t my-3" />

          <div className="space-y-2">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
