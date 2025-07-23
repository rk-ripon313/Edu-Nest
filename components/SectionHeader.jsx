export const SectionHeader = ({ title, subtitle, align = "left" }) => {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-10 ${alignment} max-w-2xl`}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-sora text-zinc-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted-foreground font-sora text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};
