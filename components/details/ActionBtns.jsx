"use client";

import { createCheckoutSessionAction } from "@/app/actions/stripe.actions";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ActionBtns = ({ itemId, price, isOwner, isEnrolled, series }) => {
  const isFree = price === 0;
  const canEnroll = !isOwner && !isEnrolled;

  // URL after enrollment or for reading/playing
  const enrolledUrl = series
    ? `/study-series/${itemId}/play`
    : `/books/${itemId}/read`;

  // Handler for enroll button
  const handleEnroll = async () => {
    if (!canEnroll) return;

    const res = await createCheckoutSessionAction({ itemId, series });
    if (res?.success) {
      if (res?.url) {
        window.location.assign(res.url);
      } else toast.success(res.message);
    } else toast.error(res.error);
  };

  return (
    <div className="flex gap-5">
      <Button disabled={isOwner} variant="outline">
        Add to Wishlist
      </Button>

      {/* Enroll / Read / Play button */}
      {isOwner ? (
        <Button disabled variant="default" title="You own this item">
          Owned
        </Button>
      ) : isEnrolled ? (
        <Link href={enrolledUrl}>
          <Button variant="default" className="font-sora font-medium">
            {series ? "Play Series" : "Read Book"}
          </Button>
        </Link>
      ) : (
        <Button
          variant="default"
          onClick={handleEnroll}
          className="font-sora font-medium"
          disabled={!canEnroll}
        >
          {isFree ? "Enroll for Free" : `Enroll Now `}
        </Button>
      )}
    </div>
  );
};

export default ActionBtns;
