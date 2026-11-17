// components/SectionWrapper.jsx

const SectionWrapper = ({ children, className = "", innerClass = "", id }) => {
  return (
    <section id={id} className={`w-full py-10 sm:py-12 lg:py-16 ${className}`}>
      <div className={`container ${innerClass}`}>{children}</div>
    </section>
  );
};

export default SectionWrapper;
