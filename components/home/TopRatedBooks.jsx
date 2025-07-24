import { getBooksByType } from "@/database/queries/books-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";

const TopRatedBooks = async () => {
  const books = await getBooksByType("rating");

  return (
    <SectionWrapper>
      <SectionHeader
        title="Top Rated Books"
        subtitle="Highest rated books by our students"
      />

      <SwiperSlider items={books} type="book" />
    </SectionWrapper>
  );
};
export default TopRatedBooks;
