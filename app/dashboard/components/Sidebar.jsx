"use client";

import {
  BookMarked,
  BookOpen,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const dashboardLinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Books", href: "/dashboard/books", icon: BookOpen },
  { name: "Study Series", href: "/dashboard/study-series", icon: BookMarked },
  { name: "Blogs", href: "/dashboard/blogs", icon: FileText },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full border-r bg-white dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              Educator Dashboard
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage content & publishing
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-slate-700">
        <div className="px-3 py-2 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Manage
        </div>
        <ul className="space-y-1">
          {dashboardLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-6 py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            );
          })}
        </ul>

        <div className="mt-6 px-3 py-2 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Support
        </div>

        <ul className="space-y-1">
          <li>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-slate-800"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="truncate">Help & Docs</span>
              <ExternalLink className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100" />
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} EduNest
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
