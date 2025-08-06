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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserNav = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  // console.log({ session });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!user) {
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
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account/enrolled-study-series">My Study Series</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account/enrolled-books">My Books</Link>
        </DropdownMenuItem>
        {user?.role === "educator" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}
        {user?.role === "student" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/account/become-educator">Become A Educator</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="transition-colors focus:bg-red-400 focus:text-accent-foreground cursor-pointer "
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNav;
