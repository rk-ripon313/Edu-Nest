import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionWrapper from "../SectionWrapper";
import CurriculumTab from "./CurriculumTab";
import DescriptionTab from "./DescriptionTab";
import ItemCardHeader from "./ItemCardHeader";
import OverviewTab from "./OverviewTab";
const ItemDetails = async ({ item, series = false }) => {
  return (
    <SectionWrapper>
      <ItemCardHeader item={item} series={series} />
      <Separator className="my-6" />

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="px-6 pb-6 overflow-hidden ">
        <TabsList className="p-1 rounded-md border mb-4 gap-2 bg-muted dark:bg-gray-950 text-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Description
          </TabsTrigger>

          {series && item.chapters?.length > 0 && (
            <TabsTrigger
              value="curriculum"
              className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
            >
              Curriculum
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Content */}
        <div className=" md:flex gap-6 bg-muted  dark:bg-gray-950 p-3 rounded-md md:w-5/6 lg:w-4/5 space-y-3">
          {/* overviewTab */}
          <OverviewTab item={item} />
          {/* description & Outcomes Tab */}
          <DescriptionTab item={item} />
          {/* chapters Tab */}
          {series && item.chapters?.length > 0 && (
            <CurriculumTab chapters={item?.chapters} />
          )}
        </div>
      </Tabs>
    </SectionWrapper>
  );
};

export default ItemDetails;
