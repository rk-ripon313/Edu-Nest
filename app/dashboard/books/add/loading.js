const BookEditLoading = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="h-8 w-56 bg-muted rounded-md animate-pulse" />

      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <div className="h-10 w-28 bg-muted rounded animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};

export default BookEditLoading;
