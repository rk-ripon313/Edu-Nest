const Loading = () => {
  return (
    <div className="container mx-auto px-3 md:px-6 py-6 animate-pulse space-y-4">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="w-full h-[220px] md:h-[420px] rounded bg-muted" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 rounded bg-muted" />
        <div className="h-40 rounded bg-muted" />
      </div>
      <div className="h-32 rounded bg-muted" />
    </div>
  );
};
export default Loading;
