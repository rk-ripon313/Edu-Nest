"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// Simulated auth
const user = {
  isLoggedIn: true,
  name: "Ripon",
  role: "educator", // or "student"
  image: "/avatar.png",
};

export function UserNav() {
  if (!user?.isLoggedIn) {
    return (
      <div className="md:flex gap-2">
        <Link href="/login">
          <Button className="font-sora" variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/register" className="hidden md:flex">
          <Button className="font-sora text-gray-100" size="sm">
            Register
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ring-1 ring-accent cursor-pointer pointer-events-auto">
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 mt-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white right-0 left-auto"
      >
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        {user.role === "educator" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="transition-colors focus:bg-red-400 focus:text-accent-foreground cursor-pointer "
          onClick={() => toast.warning("Logout!")}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
