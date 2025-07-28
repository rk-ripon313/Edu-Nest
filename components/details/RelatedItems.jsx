import { getRelatedBooks } from "@/database/queries/books-data";
import { getRelatedStudySeries } from "@/database/queries/study-series-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";

const RelatedItems = async ({ itemId, type, tags }) => {
  let items = [];
  if (type === "series") {
    items = await getRelatedStudySeries(tags, itemId);
  } else {
    items = await getRelatedBooks(tags, itemId);
  }

  return (
    <SectionWrapper>
      <SectionHeader
        title="You May Also Like"
        subtitle="Here is most related items"
      />

      <SwiperSlider items={items} type={type} />
    </SectionWrapper>
  );
};
export default RelatedItems;
