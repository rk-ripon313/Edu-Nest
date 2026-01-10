const SeriesEditLoading = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="h-8 w-60 bg-muted rounded animate-pulse" />

      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-44 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
      ))}

      <div className="flex gap-3 justify-end">
        <div className="h-10 w-28 bg-muted rounded animate-pulse" />
        <div className="h-10 w-36 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};
export default SeriesEditLoading;
