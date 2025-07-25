"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { debounce } from "@/lib/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const FilterSidebar = ({ categories }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams.toString());

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 20000,
  ]);

  const debouncedPriceChange = useCallback(
    debounce((val) => {
      const [min, max] = val;
      currentParams.set("minPrice", min);
      currentParams.set("maxPrice", max);
      router.push(`${pathname}?${currentParams.toString()}`);
    }, 300),
    [searchParams, pathname]
  );

  const updateFilter = (key, value) => {
    if (value === searchParams.get(key)) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const resetPriceFilter = () => {
    currentParams.delete("minPrice");
    currentParams.delete("maxPrice");
    setPriceRange([0, 20000]);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const isChecked = (key, val) => searchParams.get(key) === val;

  const filterGroups = [
    { key: "label", title: "Level", values: Array.from(categories.labelSet) },
    { key: "group", title: "Group", values: Array.from(categories.groupSet) },
    { key: "subject", title: "Subject", values: Array.from(categories.subSet) },
    { key: "part", title: "Part", values: Array.from(categories.partSet) },
  ];

  return (
    <div className="">
      {/* Price Slider */}
      <div className="space-y-3 border border-border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold">Filter by Price</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPriceFilter}
            className="text-xs "
          >
            Reset
          </Button>
        </div>

        <div className="space-y-2">
          <Slider
            value={priceRange}
            onValueChange={(val) => {
              setPriceRange(val);
              debouncedPriceChange(val);
            }}
            min={0}
            max={20000}
            step={50}
            className=" [&>div]:h-2
                      [&_[role=slider]]:bg-primary
                      [&_[role=slider]]:h-4 [&_[role=slider]]:w-4
                      [&_[role=slider]]:rounded-full
                      [&_[role=slider]]:border-2
                      [&_[role=slider]]:border-white
                      [&_[role=slider]]:shadow-md"
          />
          <div className="flex justify-between text-sm text-muted-foreground px-1">
            <span>Min: ৳{priceRange[0]}</span>
            <span>Max: ৳{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Other Filters */}
      <div className="space-y-3 border border-border rounded-lg p-4 mt-2">
        <Accordion type="multiple" defaultValue={["label", ""]}>
          {filterGroups.map(({ key, title, values }) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="capitalize">
                {title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {values.map((val) => (
                    <div key={val} className="flex items-center gap-2">
                      <Checkbox
                        id={`${key}-${val}`}
                        checked={isChecked(key, val)}
                        onCheckedChange={() => updateFilter(key, val)}
                      />
                      <Label
                        htmlFor={`${key}-${val}`}
                        className="capitalize text-sm"
                      >
                        {val}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
export default FilterSidebar;
