"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";
import UserNav from "./UserNav";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Study Series", href: "/study-series" },
  { name: "Books", href: "/books" },
  { name: "Blogs", href: "/blogs" },
];

export const MainNav = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/90"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div
          className={`hidden items-center justify-between lg:flex transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          <Logo />

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium font-sora transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`relative flex w-full items-center justify-between lg:hidden transition-all duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          <MobileNav links={navLinks} />

          <Logo />

          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default MainNav;
