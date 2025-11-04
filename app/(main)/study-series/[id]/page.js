import ItemBreadcrumb from "@/components/details/ItemBreadcrumb";
import ItemDetails from "@/components/details/ItemDetails";
import SectionLoadingFallback from "@/components/SectionLoadingFallback";
import { getStudySeriesById } from "@/database/queries/study-series-data";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Dynamic imports
const ReviewSection = dynamic(
  () => import("@/components/details/ReviewSection"),
  { suspense: true }
);
const RelatedItems = dynamic(
  () => import("@/components/details/RelatedItems"),
  { suspense: true }
);

export const generateMetadata = async ({ params: { id } }) => {
  const series = await getStudySeriesById(id);

  if (!series) {
    return {
      title: "Study Series Not Found | EduNest",
      description: "No study series found with the provided ID.",
    };
  }

  return {
    title: `${series.title} | EduNest`,
    description:
      series.description?.slice(0, 160) ||
      "Explore this study series on EduNest.",
    openGraph: {
      title: `${series.title} | EduNest`,
      description: series.description,
      images: [
        {
          url: series.thumbnail,
          width: 800,
          height: 600,
          alt: series.title,
        },
      ],
    },
  };
};

const StudySeriesDetailsPage = async ({ params: { id } }) => {
  const series = await getStudySeriesById(id);
  if (!series) notFound();

  return (
    <>
      <ItemBreadcrumb subNav="study-series" title={series.title} />
      <ItemDetails item={series} isSeries={true} />

      <Suspense fallback={<SectionLoadingFallback title="Review Section" />}>
        <ReviewSection itemId={id} onModel="StudySeries" />
      </Suspense>

      <Suspense
        fallback={<SectionLoadingFallback title="Related Study Series" />}
      >
        <RelatedItems itemId={id} type="series" tags={series.tags} />
      </Suspense>
    </>
  );
};

export default StudySeriesDetailsPage;
