"use client";

import { addReviewAction } from "@/app/actions/testimonial.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ReviewBtn = ({ onModel, review, itemId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || "");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addReviewAction({
        onModel,
        itemId,
        rating,
        comment,
        reviewId: review?.id || null,
      });

      if (res.success) {
        toast.success(res.message || "Review submitted successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Review submit error:", error);
      toast.error(error?.message || "Failed, please try again");
    }
  };

  return (
    <>
      <Button
        className="text-white font-sora px-6 py-3 text-base w-full"
        size="lg"
        onClick={() => setOpen(true)}
      >
        {review ? "Edit Your Review" : "Write a Review"}
      </Button>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="sm:max-w-lg w-[95%] mx-auto bg-slate-200 dark:bg-slate-950 rounded-lg">
          <DialogHeader>
            <DialogTitle className="font-grotesk font-semibold">
              {review ? "Edit Your Review" : "Write a Review"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block mb-1 text-sm">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`h-7 w-7 cursor-pointer ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block mb-1 text-sm">Comment</label>
              <textarea
                value={comment}
                rows={3}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-2 py-1 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded py-2 font-sora"
            >
              {review ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewBtn;
