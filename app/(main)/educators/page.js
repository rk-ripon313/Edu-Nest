import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";
import { getAllEducators } from "@/database/queries/educator-data";
import SearchBar from "../../../components/SearchBar";
import EducatorCard from "./components/EducatorCard";
import EducatorsSort from "./components/EducatorsSort";

const EducatorsPage = async ({ searchParams }) => {
  const search = searchParams.search || "";
  const sort = searchParams.sort || "rating"; // default: top rated

  const educators = await getAllEducators({ search, sort });
  // console.log({ educators });

  return (
    <SectionWrapper className="min-h-screen  ">
      <SectionHeader
        title="Our Educators"
        subtitle="Learn from Bangladesh's best instructors"
      />

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar />
        <EducatorsSort />
      </div>

      {educators?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
          <p className="text-xl font-semibold text-muted-foreground">
            No educators found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 p-2 bg-white dark:bg-slate-950  rounded-md">
          {educators.map((educator) => (
            <EducatorCard key={educator.id} educator={educator} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};
export default EducatorsPage;
