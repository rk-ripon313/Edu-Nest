const GlobalLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
};
export default GlobalLoading;
