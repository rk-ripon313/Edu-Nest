import { getUniqueCategories } from "@/database/queries/categories-data";
import { getEducatorItemInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import SeriesHeaderControls from "../../components/SeriesHeaderControls";

const EditStudySeriesPage = async ({ params: { studySeriesId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const studySeries = await getEducatorItemInfobyId(
    "StudySeries",
    studySeriesId,
    user?.id
  );
  // console.log({ studySeries });

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

  const categories = await getUniqueCategories();

  // console.log({ studySeries });

  return (
    <div className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between  px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-grotesk">Edit Study Series</h1>
          <p className=" mt-1">Manage your study Series information</p>
        </div>
        <SeriesHeaderControls studySeries={studySeries} />
      </div>
    </div>
  );
};

export default EditStudySeriesPage;
