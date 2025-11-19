"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const EducatorsSort = () => {
  const router = useRouter();
  const sortParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = sortParams.get("sort") || "rating";

  const handleChange = (val) => {
    const params = new URLSearchParams(sortParams.toString());
    if (val) {
      params.set("sort", val);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[200px] bg-background">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-muted dark:bg-slate-900">
        <SelectItem value="rating">Top Rated</SelectItem>
        <SelectItem value="enroll">Most Enrolled</SelectItem>
        <SelectItem value="followers">Most Followed</SelectItem>
      </SelectContent>
    </Select>
  );
};
export default EducatorsSort;
