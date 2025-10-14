import ItemHeaderControls from "@/app/dashboard/components/ItemHeaderControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEducatorItemInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import SeriesOverviewTab from "../../components/SeriesOverviewTab";

const EditStudySeriesPage = async ({ params: { studySeriesId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const studySeries = await getEducatorItemInfobyId(
    "StudySeries",
    studySeriesId,
    user?.id
  );

  if (!studySeries) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Study-Series Not Found
          </h1>
          <p className="text-gray-500">
            {`The Study-Series you're looking for doesn't exist.`}
          </p>
        </div>
      </div>
    );
  }

  // console.log({ studySeries });

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 ">
      {/* Header */}
      <div className="flex items-center justify-between  px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-grotesk">Edit Study Series</h1>
          <p className=" mt-1">Manage your study Series information</p>
        </div>
        <ItemHeaderControls item={studySeries} onModel="StudySeries" />
      </div>

      <Tabs defaultValue="overview" className="">
        <TabsList className="mx-4 my-2 rounded-md shadow-sm bg-muted dark:bg-slate-800 ">
          <TabsTrigger
            value="overview"
            className="text-sm font-sora px-3 py-2 rounded-md transition-colors
                 data-[state=active]:bg-primary data-[state=active]:text-white
                 hover:bg-primary/20"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="curriculum"
            className="text-sm font-sora px-3 py-2 rounded-md transition-colors
                 data-[state=active]:bg-primary data-[state=active]:text-white
                 hover:bg-primary/20"
          >
            Curriculum
          </TabsTrigger>
        </TabsList>

        {/* Tab contents overview + curriculum */}
        <TabsContent value="overview">
          <SeriesOverviewTab studySeries={studySeries} />
        </TabsContent>

        <TabsContent value="curriculum">
          {/* Curriculum content here */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditStudySeriesPage;
