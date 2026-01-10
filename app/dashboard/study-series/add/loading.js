const SeriesAddLoading = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="h-8 w-56 bg-muted rounded animate-pulse" />

      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
      ))}

      <div className="flex justify-end">
        <div className="h-11 w-36 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};
export default SeriesAddLoading;
