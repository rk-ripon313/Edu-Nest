import { getTestimonials } from "@/database/queries/testimonials-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import RatingOverview from "./RatingOverview";
import ReviewList from "./ReviewList";

const ReviewSection = async ({ itemId, onModel }) => {
  const reviews = await getTestimonials(onModel, itemId);
  //console.log(reviews);

  return (
    <SectionWrapper even>
      <SectionHeader
        title="What Our Students Say"
        subtitle="Here’s what learners are saying after completing this book"
      />

      {/* Rating Overview + Reviews */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Rating Overview */}
        <RatingOverview reviews={reviews} />
        {/*  Review List*/}
        <ReviewList reviews={reviews} />
      </div>
    </SectionWrapper>
  );
};

export default ReviewSection;
