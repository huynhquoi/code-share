"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOut, User2, FileCode2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";

export function UserMenu() {
  const router = useRouter();
  const username = "johndoe"; // TODO: lấy từ session

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    // TODO: gọi signOut() nếu dùng next-auth
    console.log("Logout clicked");
  };

  if (isMobile) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="user-menu">
          <AccordionTrigger className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md">
            <Avatar className="w-6 h-6">
              <AvatarImage src="" alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{username}</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Button
              onClick={() => router.push("/profile")}
              className="flex items-center text-left text-sm hover:text-primary"
              variant="ghost"
            >
              <User2 className="w-4 h-4 mr-2" /> <span>Profile</span>
            </Button>
            <Button
              className="flex items-center text-left text-sm hover:text-primary"
              variant="ghost"
            >
              <FileCode2 className="w-4 h-4 mr-2" /> <span>My Snippets</span>
            </Button>
            <Button
              className="flex items-center text-sm text-red-500 hover:underline"
              variant="ghost"
            >
              <LogOut className="w-4 h-4 mr-2" /> <span>Logout</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt={username} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium">
            {username}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User2 className="w-4 h-4 mr-2" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/my-snippets")}>
          <FileCode2 className="w-4 h-4 mr-2" /> My Snippets
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
