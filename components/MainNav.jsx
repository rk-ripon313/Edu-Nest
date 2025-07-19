"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { UserNav } from "./UserNav";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Books", href: "/books" },
  { name: "Blogs", href: "/blogs" },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-muted dark:bg-zinc-950 text-zinc-900 dark:text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between">
          <Logo />
          <nav className="flex gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors font-sora hover:text-primary ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-zinc-900 dark:text-white"
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

        {/* Mobile View */}
        <div className="flex lg:hidden w-full justify-between items-center h-16 relative">
          <MobileNav links={navLinks} />
          <Logo />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
