"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
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
        <SelectItem value="latest">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Latest</span>
          </div>
        </SelectItem>
        <SelectItem value="oldest">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Oldest</span>
          </div>
        </SelectItem>
        <SelectItem value="price-low">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            <span>Low to High</span>
          </div>
        </SelectItem>
        <SelectItem value="price-high">
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            <span>High to Low</span>
          </div>
        </SelectItem>
        {/* Future options:
        <SelectItem value="rating">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Rating</span>
          </div>
        </SelectItem>
        <SelectItem value="enrollment">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Enroll Count</span>
          </div>
        </SelectItem> */}
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
