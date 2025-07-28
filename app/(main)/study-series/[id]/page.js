import ItemBreadcrumb from "@/components/details/ItemBreadcrumb";
import ItemDetails from "@/components/details/ItemDetails";
import RelatedItems from "@/components/details/RelatedItems";
import ReviewSection from "@/components/details/ReviewSection";
import { getStudySeriesById } from "@/database/queries/study-series-data";

const StudySeriesDetailsPage = async ({ params: { id } }) => {
  const series = await getStudySeriesById(id);

  return (
    <>
      <ItemBreadcrumb subNav={"study-series"} title={series.title} />
      <ItemDetails item={series} />
      <ReviewSection itemId={id} onModel={"StudySeries"} />
      <RelatedItems itemId={id} type="series" tags={series.tags} />
    </>
  );
};
export default StudySeriesDetailsPage;
