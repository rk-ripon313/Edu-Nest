const ProfileLoading = () => {
  return (
    <section className="p-4 space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center gap-8 border rounded-lg p-6">
        <div className="h-32 w-32 rounded-full bg-muted" />

        <div className="space-y-3 flex-1">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-4 w-52 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />

          <div className="flex gap-4 mt-2">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Profile form fields */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-muted rounded-lg" />
        ))}
      </div>
    </section>
  );
};
export default ProfileLoading;
