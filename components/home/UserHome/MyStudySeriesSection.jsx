import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import Empty from "@/components/Empty";
import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";
import { getEnrolledItems } from "@/database/queries/enrollments-data";

import EnrolledItemCard from "./EnrolledItemCard";

const MyStudySeriesSection = async ({ userId }) => {
  const series = await getEnrolledItems(userId, "StudySeries", {
    sort: "latest",
    limit: 3,
  });

  return (
    <SectionWrapper className="pt-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeader
          title="My Study Series"
          subtitle="Continue learning through your enrolled study series."
        />

        <Link
          href="/account/enrolled-study-series"
          className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Explore All
          <ArrowRight size={16} />
        </Link>
      </div>

      {series.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item) => (
            <EnrolledItemCard key={item.id} item={item} type="series" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <Empty
            title="No study series yet"
            subTitle="Discover structured lessons and start a new learning journey."
            icon={GraduationCap}
            variant="compact"
          />

          <div className="flex justify-center pb-6">
            <Link
              href="/study-series"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Explore Study Series
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default MyStudySeriesSection;
