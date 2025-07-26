"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SortDropdown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = searchParams.get("sort") || "latest";

  const updateSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <Select value={current} onValueChange={updateSort}>
      <SelectTrigger className="w-[160px] sm:w-[170px] md:w-[180px] lg:-w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="bg-muted dark:bg-slate-900">
        <SelectItem value="latest">📅 Latest</SelectItem>
        <SelectItem value="oldest">📅 Oldest</SelectItem>
        <SelectItem value="price-low">💰 Low to High</SelectItem>
        <SelectItem value="price-high">💰 High to Low</SelectItem>
        <SelectItem value="rating">⭐ Rating</SelectItem>
        <SelectItem value="enrollment">👥 Enroll Count</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
