import Empty from "@/components/Empty";
import FilterSidebar from "@/components/FilterSidebar";
import ItemCard from "@/components/ItemCard";
import MobileFilter from "@/components/MobileFilter";
import Pagination from "@/components/Pagination";
import ResetSearch from "@/components/ResetSearch";
import SearchBar from "@/components/SearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";
import SortDropdown from "@/components/SortDropdown";
import TabListNav from "@/components/TabListNav";

import { getUniqueCategories } from "@/database/queries/categories-data";
import { getStudySeries } from "@/database/queries/study-series-data";

const StudySeriesPage = async ({ searchParams }) => {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 9;

  const { allStudySeries, totalCount } = await getStudySeries({
    ...searchParams,
    page: currentPage,
    itemsPerPage,
  });
  // console.log(allBooks);

  const categories = await getUniqueCategories();
  // console.log(categories);

  return (
    <>
      <TabListNav />
      <SectionWrapper className="min-h-screen ">
        {/* Header */}
        <SectionHeader
          title={"All Study-Series "}
          subtitle={"Choise Series by your Demand"}
        />

        {/* Mobile Layout */}
        <MobileFilter categories={categories} />

        {/* Desktop Layout */}
        <div className="hidden md:block mb-4">
          <div className="flex justify-between items-center mb-6">
            <SearchBar />
            <ResetSearch />
            <SortDropdown />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar Filters (Only on Desktop) */}
          <div className="hidden md:block ">
            <FilterSidebar categories={categories} />
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {allStudySeries?.length > 0 ? (
              <div className="grid grid-cols-2  lg:grid-cols-3 gap-6">
                {allBooks?.map((book) => (
                  // {/* series Cards */}
                  <ItemCard key={book?.id} item={book} type={"series"} />
                ))}
              </div>
            ) : (
              <Empty
                title={"No Series Found"}
                subTitle={"Try adjusting your search or filters"}
              />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              itemsPerPage={itemsPerPage}
              basePath="/study-series"
            />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default StudySeriesPage;
