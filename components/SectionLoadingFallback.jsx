import Spinner from "./ui/Spinner";

const SectionLoadingFallback = ({ title }) => {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-muted dark:bg-slate-950">
      <div className="container">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="flex justify-center items-center py-10">
          <Spinner />
        </div>
      </div>
    </section>
  );
};

export default SectionLoadingFallback;
