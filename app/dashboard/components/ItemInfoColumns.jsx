"use client";
import { ArrowUpDown, Star } from "lucide-react";
export const itemInfoColumns = [
  {
    header: "Full Name",
    id: "fullName",
    accessorFn: (row) => {
      const { firstName, lastName, name } = row.student;
      return firstName || lastName
        ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
        : name || "Unknown";
    },
    cell: (info) => <span className="font-medium "> {info.getValue()}</span>,
  },
  {
    header: "Email",
    accessorKey: "student.email",
  },
  {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Enrollment Date <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    accessorKey: "enrollment.createdAt",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  },
  {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Paid Amount <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    accessorKey: "enrollment.price",
    cell: (info) =>
      info.getValue() === 0 ? (
        <span className="text-green-600">Free</span>
      ) : (
        `৳${info.getValue()}`
      ),
  },
  {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center justify-center gap-1 w-full"
      >
        Rating <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    id: "rating",
    accessorFn: (row) => row.review?.rating ?? 0,
    cell: (info) => {
      const rating = info.getValue();
      return rating ? (
        <div className="flex justify-center items-center">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
      ) : (
        "--"
      );
    },
  },
  {
    header: "Comment",
    id: "comment",
    accessorFn: (row) => row.review?.comment ?? "--",
  },
];
