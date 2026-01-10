"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/debounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const BlogFilters = ({ sort }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || sort;

  // debounce search
  const handleSearch = debounce((value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set("search", value);
    else params.delete("search");

    router.push(`?${params.toString()}`);
  }, 400);

  // handle sort
  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-5 w-full">
      {/* ---- Search ---- */}
      <div className="relative w-[70%] ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          defaultValue={currentSearch}
          placeholder="Search blogs..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* ---- Sort ---- */}
      <div className="w-[30%] ">
        <Select value={currentSort} onValueChange={handleSort}>
          <SelectTrigger className="w-full bg-white dark:bg-slate-800">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-muted dark:bg-slate-800">
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BlogFilters;
