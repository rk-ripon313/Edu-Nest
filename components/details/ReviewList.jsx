"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/formetData";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import Empty from "../Empty";
import { Button } from "../ui/button";

const ReviewList = ({ reviews }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? reviews : reviews.slice(0, 5);
  if (reviews.length === 0) {
    return (
      <div className="md:w-2/3 bg-white dark:bg-dark_bg p-6 rounded-lg shadow-sm text-center text-muted-foreground text-sm">
        <Empty title={"No reviews yet."} />
      </div>
    );
  }
  return (
    <div className="md:w-2/3 ">
      <div
        className={`
          h-auto
          bg-white dark:bg-dark_bg 
          p-4 rounded-lg shadow-sm space-y-4
          ${expanded ? "overflow-y-auto" : "overflow-hidden"}
          transition-all duration-300
        `}
      >
        {visibleReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.student?.image} />
                <AvatarFallback>
                  {review.student?.firstName?.charAt(0)}
                  {review.student?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="font-medium text-base">
                      {review.student?.firstName} {review.student?.lastName}
                    </h4>
                    <div className="flex items-center mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Absolute Show/Hide Button */}
      {reviews.length > 5 && (
        <div className="p-2 flex justify-end">
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="outline"

            //className="text-xs px-2 py-1 border rounded-md border-primary text-primary hover:bg-primary/10 transition"
          >
            {expanded ? "Hide Reviews" : "Show All"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
