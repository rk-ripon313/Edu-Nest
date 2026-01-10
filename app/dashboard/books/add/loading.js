import { Skeleton } from "@/components/ui/Skeleton";

const BookAddLoading = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-pulse rounded-md bg-muted h-8 w-48" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      <div className="flex justify-end">
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
};
export default BookAddLoading;
