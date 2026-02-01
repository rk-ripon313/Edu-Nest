const EnrolledBooksLoading = () => {
  return (
    <section className="max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-64 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>

      {/* Search bar */}
      <div className="h-10 w-full bg-muted rounded-lg" />

      {/* Cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 w-full bg-muted rounded-xl" />
        ))}
      </div>
    </section>
  );
};
export default EnrolledBooksLoading;
