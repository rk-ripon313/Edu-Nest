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
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserNav = () => {
  // console.log({ session });

  const [loggedInUser, setLoggedInUser] = useState(null);
  const { firstName, lastName, image, name, role } = loggedInUser || {};

  const currentUserName = firstName
    ? firstName?.[0].toUpperCase() + lastName?.[0].toUpperCase()
    : name?.[0].toUpperCase();

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        //console.log(data);
        setLoggedInUser(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchMe();
  }, []);

  if (!loggedInUser) {
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
          <AvatarImage src={image} />
          <AvatarFallback>{currentUserName}</AvatarFallback>
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
        {role === "educator" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        )}
        {role === "student" && (
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
