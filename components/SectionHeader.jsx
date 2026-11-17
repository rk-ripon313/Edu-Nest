export const SectionHeader = ({ title, subtitle, align = "left" }) => {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-8 md:mb-10 ${alignment} max-w-2xl`}>
      <h2 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm sm:text-base md:text-lg text-muted-foreground font-sora leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
