"use client";
import { addReviewAction } from "@/app/actions/testimonial.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ReviewDialog = ({ open, onClose, itemId, review, onModel, onSaved }) => {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await addReviewAction({
        onModel,
        itemId,
        rating,
        comment,
        reviewId: review?._id || null,
      });

      if (res.success) {
        toast.success(res.message || "Review submitted successfully!");
        onSaved();
      } else {
        toast.error(res.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Review submit error:", error);
      toast.error(error?.message || "Failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                  onClick={() => !isSubmitting && setRating(star)}
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
              disabled={isSubmitting}
              className="w-full border rounded px-2 py-1 resize-none disabled:opacity-60"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white rounded py-2 font-sora disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? review
                ? "Updating..."
                : "Submitting..."
              : review
                ? "Update Review"
                : "Submit Review"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
