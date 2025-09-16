"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, EyeOff, Info, Pencil, Star } from "lucide-react";
import Link from "next/link";

export const bookColumns = [
  {
    accessorFn: (row) =>
      `${row.title} ${row.category?.group} ${row.category?.label} ${row.category?.subject} ${row.category?.part}`,
    id: "title",
    header: "Title",
    cell: ({ row }) => {
      const book = row.original;
      const c = book.category;
      return (
        <div className=" text-left">
          <p className="font-medium text-left">{book.title}</p>
          <div className="flex flex-wrap gap-1">
            <span>{c.label}</span> • <span>{c.group}</span> •
            <span>{c.subject}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalEnrollments",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Enrollments <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-center block">{row.original.totalEnrollments}</span>
    ),
  },
  {
    accessorKey: "averageRating",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Rating <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const rating = row.original.averageRating ?? 0;
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Price <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-center block">{row.original.price}</span>
    ),
  },
  {
    accessorFn: (row) => (row.isPublished ? "Published" : "Draft"),
    id: "status",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Status <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span
        className={`text-center block font-medium ${
          row.original.isPublished ? "text-green-600" : "text-red-500"
        }`}
      >
        {row.original.isPublished ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        {/* Edit */}
        <Link href={`/dashboard/books/${row.original._id}/edit`}>
          <Button variant="outline" size="icon" className="hover:scale-x-105">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        {/* Publish / Unpublish */}
        <Button
          variant="outline"
          size="icon"
          className={
            row.original.isPublished
              ? "text-red-500 hover:bg-red-50"
              : "text-green-600 hover:bg-green-50"
          }
        >
          {row.original.isPublished ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        {/* //other informations */}
        <Link href={`/dashboard/books/${row.original._id}/info`}>
          <Button variant="outline" size="icon" className="hover:scale-x-105">
            <Info className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];
// Student Name	Student Email	Quiz Mark	Progress	Enroll Date
