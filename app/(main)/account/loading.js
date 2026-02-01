const AccountLoading = () => {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-4 space-y-6 animate-pulse">
        {/* Header card */}
        <div className="rounded-xl border bg-card p-5 flex gap-4 items-center">
          <div className="h-24 w-24 rounded-full bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-4 w-56 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />

            <div className="flex gap-4 mt-2">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Content blocks */}
        <div className="space-y-3">
          <div className="h-12 w-full bg-muted rounded-lg" />
          <div className="h-12 w-full bg-muted rounded-lg" />
        </div>
      </main>
    </div>
  );
};

export default AccountLoading;
