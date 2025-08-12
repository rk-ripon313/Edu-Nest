import { getRatingLabel } from "@/lib/stats-utils";
import { StarIcon } from "lucide-react";

const RatingOverview = ({ reviews }) => {
  const ratingDistribution = [0, 0, 0, 0, 0];
  let totalRating = 0;

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[5 - review.rating]++;
      totalRating += review.rating;
    }
  });

  const averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  const mostRatedStar =
    reviews.length > 0
      ? 5 - ratingDistribution.indexOf(Math.max(...ratingDistribution))
      : 0;

  const percent5Star =
    reviews.length > 0
      ? ((ratingDistribution[0] / reviews.length) * 100).toFixed(0)
      : 0;

  return (
    <div className="md:w-1/3 p-6 rounded-lg h-fit bg-white dark:bg-dark_bg space-y-5 md:pb-16 md:pt-10">
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold">{averageRating}</div>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
        <p className="text-sm font-medium text-green-600">
          {reviews.length > 0
            ? getRatingLabel(averageRating)
            : "No ratings yet"}
        </p>
      </div>

      {/* 5 Star Percentage */}
      <div className="shadow-md p-3 rounded-md text-sm text-center">
        {reviews.length > 0 ? (
          <>
            <p>
              <span className="font-semibold text-foreground">
                {percent5Star}%
              </span>{" "}
              of students gave a 5-star rating
            </p>
            <p>
              Most common rating: <strong>{mostRatedStar} stars</strong>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No reviews available yet.</p>
        )}
      </div>

      {/* Rating Distribution */}
      <div>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div key={rating} className="flex items-center mb-2">
            <div className="w-10 text-sm font-medium flex items-center">
              {rating}
              <StarIcon className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex-1 mx-2 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2.5 bg-yellow-400 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    reviews.length > 0
                      ? (ratingDistribution[index] / reviews.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-muted-foreground w-10 text-right">
              {ratingDistribution[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingOverview;
