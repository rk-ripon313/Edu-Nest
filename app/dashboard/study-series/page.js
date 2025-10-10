import { getEducatorItems } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import { seriesColumns } from "./components/seriesColumns";
import StudySeriesTable from "./components/StudySeriesTable";

const StudySeriesListPage = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const studySeries = await getEducatorItems("StudySeries", user?.id, true);
  // console.log({ studySeries });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Study-Series</h1>
      </div>

      <StudySeriesTable data={studySeries} columns={seriesColumns} />
    </div>
  );
};
export default StudySeriesListPage;
