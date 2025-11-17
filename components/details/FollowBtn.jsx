"use client";

import { toggleFollow } from "@/app/actions/account/accountActions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const FollowBtn = ({
  isOwner = false,
  isFollowing = false,
  educatorUserName,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollow = async () => {
    setLoading(true);

    try {
      const follow = await toggleFollow({ isFollowing, educatorUserName });
      if (follow?.success && follow.data !== isFollowing) {
        router.refresh();
      } else {
        toast.error(follow?.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something Went Rong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleFollow}
      disabled={isOwner || loading}
      className={`relative text-sm font-sora font-medium px-2 py-0.5 rounded-full border transition-all duration-200 ${
        isFollowing
          ? "text-primary border-primary/30 bg-primary/10 hover:bg-primary/20"
          : "text-primary border-primary hover:bg-primary/10"
      } disabled:opacity-60 flex items-center gap-1`}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </button>
  );
};
export default FollowBtn;
