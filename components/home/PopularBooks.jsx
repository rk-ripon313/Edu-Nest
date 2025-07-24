import { getBooksByType } from "@/database/queries/books-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";

const PopularBooks = async () => {
  const books = await getBooksByType("enroll");

  return (
    <SectionWrapper>
      <SectionHeader
        title="Popular Books"
        subtitle="Books with the highest enrollment"
      />

      <SwiperSlider items={books} type="book" />
    </SectionWrapper>
  );
};
export default PopularBooks;
