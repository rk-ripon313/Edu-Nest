"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const MobileNav = ({ links }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0">
          <Menu className="h-7 w-7" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 sm:w-80 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mt-6 mb-2">
          <SheetTitle className="text-lg font-semibold">Edu-Nest</SheetTitle>
          <ThemeToggle />
        </div>

        <div className="mt-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)} // 👈 Close sheet on link click
              className="block text-sm font-sora hover:text-primary"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t flex gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="font-sora" variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="font-sora text-white bg-primary" size="sm">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileNav;
