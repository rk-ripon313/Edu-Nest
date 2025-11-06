"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

const PaginationBar = ({ totalCount, currentPage, itemsPerPage }) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", page);
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  //  Dynamic visible range
  const pageNumbers = [];
  const maxVisible = 5;
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className="flex justify-center pt-6">
      <Pagination>
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              className={
                currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/*  First Page + Left Ellipsis */}
          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
              </PaginationItem>
              {start > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/*  Page Numbers */}
          {pageNumbers.map((num) => (
            <PaginationItem key={num}>
              <PaginationLink
                isActive={num === currentPage}
                onClick={() => goToPage(num)}
                className="cursor-pointer"
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Right Ellipsis + Last Page */}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/*  Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationBar;
