"use client";

import { createCheckoutSessionAction } from "@/app/actions/stripe.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ActionBtns = ({ itemId, price, isOwner, isEnrolled, isSeries }) => {
  const router = useRouter();
  const isFree = price === 0;
  const canEnroll = !isOwner && !isEnrolled;

  // URL after enrollment or for reading/playing
  const enrolledUrl = isSeries
    ? `/study-series/${itemId}/play`
    : `/books/${itemId}/read`;

  // Edit URL for owner
  const editUrl = isSeries
    ? `/dashboard/study-series/${itemId}/edit`
    : `/dashboard/books/${itemId}/edit`;

  // Handler for enroll button
  const handleEnroll = async () => {
    if (!canEnroll) return;

    const res = await createCheckoutSessionAction({ itemId, isSeries });
    if (res?.success) {
      if (res?.url) {
        window.location.assign(res.url);
      } else toast.success(res.message);
    } else toast.error(res.error);
  };

  // Handler for owned item (redirect to edit page)
  const handleOwned = () => {
    router.push(editUrl);
  };

  return (
    <div className="flex gap-5">
      {/* Wishlist button */}
      <Button disabled={isOwner} variant="outline">
        Add to Wishlist
      </Button>

      {/* Main action button */}
      {isOwner ? (
        <Button
          variant="default"
          onClick={handleOwned}
          className="font-sora font-medium"
        >
          Edit {isSeries ? "Series" : "Book"}
        </Button>
      ) : isEnrolled ? (
        <Link href={enrolledUrl}>
          <Button variant="default" className="font-sora font-medium">
            {isSeries ? "Play Series" : "Read Book"}
          </Button>
        </Link>
      ) : (
        <Button
          variant="default"
          onClick={handleEnroll}
          className="font-sora font-medium"
          disabled={!canEnroll}
        >
          {isFree ? "Enroll for Free" : "Enroll Now"}
        </Button>
      )}
    </div>
  );
};

export default ActionBtns;
