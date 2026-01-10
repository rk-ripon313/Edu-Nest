const BlogEditLoading = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="h-8 w-56 bg-muted rounded animate-pulse" />

      <div className="h-10 w-full bg-muted rounded animate-pulse" />
      <div className="h-64 w-full bg-muted rounded animate-pulse" />

      <div className="flex gap-3 justify-end">
        <div className="h-10 w-28 bg-muted rounded animate-pulse" />
        <div className="h-10 w-36 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};
export default BlogEditLoading;
