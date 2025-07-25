"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ResetSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const resetAllFilters = () => {
    router.push(pathname); // remove all query params
  };

  return (
    <>
      {/* Reset All Button */}
      {searchParams.toString() && (
        <div className="">
          <Button
            variant="destructive"
            size="md"
            onClick={resetAllFilters}
            className="rounded-md py-1 px-2 hover:bg-red-500 border-red-500  border"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </>
  );
};
export default ResetSearch;
