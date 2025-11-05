"use client";

import { deleteReview } from "@/app/actions/testimonial.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ReviewDialog from "./ReviewDialog";

const ReviewAction = ({ onModel, review, itemId }) => {
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const router = useRouter();

  //close the Modal fn
  const onClose = () => setOpenReviewDialog(false);
  const onSaved = () => {
    setOpenReviewDialog(false);
    router.refresh();
  };

  //Delate  Review
  const handleDelete = async (e) => {
    try {
      const res = await deleteReview({ reviewId: review.id, onModel });
      if (res.success) {
        toast.success(res?.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  return (
    <>
      <div className="flex justify-start gap-4 p-2 items-center w-full ">
        <Button
          className="text-white font-sora px-3 py-2 text-base "
          size="lg"
          onClick={() => setOpenReviewDialog(true)}
        >
          {review ? "Edit Your Review" : "Write a Review"}
        </Button>
        {review && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                title="Delete Review"
                className="bg-slate-200  dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-105"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white "
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/*  review Modal */}
      <ReviewDialog
        open={openReviewDialog}
        onClose={onClose}
        itemId={itemId}
        review={review}
        onModel={onModel}
        onSaved={onSaved}
      />
    </>
  );
};

export default ReviewAction;
