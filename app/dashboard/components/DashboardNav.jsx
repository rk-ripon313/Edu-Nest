"use client";

import ThemeToggle from "@/components/ThemeToggle";
import UserNav from "@/components/UserNav";
import MobileSidebar from "./MobileSidebar";

const DashBoardNavbar = () => {
  return (
    <header className="h-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Mobile trigger */}
        <MobileSidebar />

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default DashBoardNavbar;
