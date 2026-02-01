const EnrolledSeriesLoading = () => {
  return (
    <section className="max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-72 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>

      <div className="h-10 w-full bg-muted rounded-lg" />

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 w-full bg-muted rounded-xl" />
        ))}
      </div>
    </section>
  );
};
export default EnrolledSeriesLoading;
