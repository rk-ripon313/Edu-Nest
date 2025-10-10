import { itemInfoColumns } from "@/app/dashboard/components/ItemInfoColumns";
import ItemOverviewCard from "@/app/dashboard/components/ItemOverviewCard";
import ItemsInfoTable from "@/app/dashboard/components/ItemsInfoTable";
import { getEducatorItemInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";

const SeriesDetailsPage = async ({ params: { studySeriesId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const studySeries = await getEducatorItemInfobyId(
    "StudySeries",
    studySeriesId,
    user?.id,
    true
  );
  if (!studySeries) return <p>studySeries not found or access denied</p>;
  // console.log(studySeries.student);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* studySeries Overview */}
      <ItemOverviewCard
        title={studySeries.title}
        category={studySeries.category}
        price={studySeries.price}
        isPublished={studySeries.isPublished}
        type="studySeries"
      />
      {/* review and enrollments  */}
      <ItemsInfoTable
        data={studySeries.students || []}
        columns={itemInfoColumns}
      />
    </div>
  );
};
export default SeriesDetailsPage;
