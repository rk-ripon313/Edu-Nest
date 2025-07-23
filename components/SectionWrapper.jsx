// components/SectionWrapper.jsx
const SectionWrapper = ({
  children,
  className = "",
  even = false,
  innerClass = "",
}) => {
  return (
    <section
      className={`w-full py-8 md:py-12 lg:py-16 ${
        even && "bg-muted dark:bg-slate-950"
      } ${className}`}
    >
      <div className={`container ${innerClass}`}>{children}</div>
    </section>
  );
};

export default SectionWrapper;
