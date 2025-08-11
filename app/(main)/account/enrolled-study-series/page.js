import { getEnrolledItems } from "@/database/queries/enrollments-data";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import EnrolledItemCard from "../components/EnrolledItemCard";
import SearchSortBar from "../components/SearchSortBar";

const EnrolledStudySeriesPage = async ({ searchParams }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const studySeries = await getEnrolledItems(user?.id, "StudySeries", {
    ...searchParams,
  });
  // console.log(studySeries);

  return (
    <section className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold font-grotesk">
          My Enrolled Study Series
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here are the Series you have enrolled in. Click to read anytime.
        </p>
      </header>

      <SearchSortBar />

      <div className="space-y-6">
        {studySeries.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            No enrolled Study Series found.
          </p>
        ) : (
          studySeries.map((series) => (
            <EnrolledItemCard key={series.id} item={series} type="series" />
          ))
        )}
      </div>
    </section>
  );
};

export default EnrolledStudySeriesPage;
