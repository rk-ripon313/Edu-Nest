const SeriesInfoLoading = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="h-8 w-72 bg-muted rounded animate-pulse" />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
};
export default SeriesInfoLoading;
