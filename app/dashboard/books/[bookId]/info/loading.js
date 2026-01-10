const BookInfoLoading = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="h-8 w-64 bg-muted rounded animate-pulse" />
      <div className="h-4 w-80 bg-muted rounded animate-pulse" />

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
};
export default BookInfoLoading;
