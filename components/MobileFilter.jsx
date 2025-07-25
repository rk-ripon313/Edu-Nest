"use client";

import { SlidersHorizontal } from "lucide-react";

// for mobile sidebar
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import FilterSidebar from "./FilterSidebar";
import ResetSearch from "./ResetSearch";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";

const MobileFilter = ({ categories }) => {
  return (
    <div className="md:hidden space-y-3 mb-4 ">
      <SearchBar />

      <div className="flex justify-between items-center ">
        <Sheet className="">
          <SheetTrigger>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <SlidersHorizontal size={16} />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-light_bg dark:bg-gray-900 overflow-y-auto max-h-screen"
          >
            <SheetHeader className={"mb-4"}>
              <SheetTitle className="text-left">Filter Edu-Content</SheetTitle>{" "}
            </SheetHeader>
            <FilterSidebar categories={categories} />
          </SheetContent>
        </Sheet>
        <ResetSearch />
        <SortDropdown />
      </div>
    </div>
  );
};
export default MobileFilter;
