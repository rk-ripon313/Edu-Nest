"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800 transition">
        <Menu className="w-5 h-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[280px] bg-white dark:bg-slate-950 text-zinc-900 dark:text-white"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
