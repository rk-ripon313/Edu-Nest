"use client";

import { BookMarked, BookOpen, FileText, PlusCircle } from "lucide-react";
import Link from "next/link";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Educator!</h1>
        <p className="text-muted-foreground">
          Manage your books, study series, and blogs from one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow">
          <div className="flex items-center justify-between">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">12</span>
          </div>
          <p className="mt-2 text-sm">Books Published</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow">
          <div className="flex items-center justify-between">
            <BookMarked className="h-6 w-6" />
            <span className="text-lg font-semibold">5</span>
          </div>
          <p className="mt-2 text-sm">Study Series</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow">
          <div className="flex items-center justify-between">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-semibold">8</span>
          </div>
          <p className="mt-2 text-sm">Blogs</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow">
          <div className="flex items-center justify-between">
            <PlusCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">220</span>
          </div>
          <p className="mt-2 text-sm">Enrollments</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/dashboard/books/new"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Book
          </Link>
          <Link
            href="/dashboard/study-series/new"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Study Series
          </Link>
          <Link
            href="/dashboard/blogs/new"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Blog
          </Link>
        </div>
      </div>
    </div>
  );
};
export default DashboardHome;
