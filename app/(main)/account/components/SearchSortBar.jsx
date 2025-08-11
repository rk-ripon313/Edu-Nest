"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchSortBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");

  const handleSearch = debounce((val) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  const updateSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    setSort(value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 items-center w-full max-w-5xl">
      <input
        type="search"
        placeholder="Search your enrolled books..."
        value={query}
        onChange={handleChange}
        className="flex-grow border rounded px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700 w-full md:w-auto"
      />
      <Select value={sort} onValueChange={updateSort}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-muted dark:bg-slate-900">
          <SelectItem value="latest">📅 Latest</SelectItem>
          <SelectItem value="oldest">📅 Oldest</SelectItem>
          <SelectItem value="price-low">💰 Low to High</SelectItem>
          <SelectItem value="price-high">💰 High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchSortBar;
