// components/logo.js

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({ className = "" }) => {
  return (
    <Link
      href="/"
      className={cn(
        "relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20", // responsive sizes
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="logo"
        fill
        priority
        className="object-contain"
      />
    </Link>
  );
};
