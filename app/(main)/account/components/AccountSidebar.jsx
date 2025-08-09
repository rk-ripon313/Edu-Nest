"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookMarked,
  BookOpen,
  LayoutDashboard,
  Lock,
  Pencil,
  Sparkles,
  User,
} from "lucide-react";

const AccountSidebar = ({ role }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "My Profile",
      href: "/account/profile",
      icon: User,
    },
    {
      label: "My Books",
      href: "/account/enrolled-books",
      icon: BookOpen,
    },
    {
      label: "My Study Series ",
      href: "/account/enrolled-study-series",
      icon: BookMarked,
    },
    {
      label: "Change Password",
      href: "/account/password",
      icon: Lock,
    },
    // Show only if not educator
    ...(role !== "educator"
      ? [
          {
            label: "Become Educator",
            href: "/account/become-educator",
            icon: Sparkles,
          },
        ]
      : []),
    // Show only if educator
    ...(role === "educator"
      ? [
          {
            label: "Educator Profile",
            href: "/account/educator-profile",
            icon: Pencil,
          },
          {
            label: "Educator Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex flex-col gap-1 p-2 mt-3">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sora transition-all",
              isActive
                ? "bg-primary text-white"
                : "hover:bg-primary text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default AccountSidebar;
