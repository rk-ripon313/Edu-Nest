"use client";

import { toggleFollow } from "@/app/actions/account/accountActions";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FollowBtn = ({
  isOwner = false,
  isFollowing = false,
  educatorUserName,
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);

    try {
      const res = await toggleFollow({ educatorUserName });
      if (res?.success) {
        setFollowing(res.data);
      } else {
        toast.error(res?.message || "Something Went Wrong");
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
        following
          ? "text-primary border-primary/30 bg-primary/10 hover:bg-primary/20"
          : "text-primary border-primary hover:bg-primary/10"
      } disabled:opacity-60 flex items-center gap-1`}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      <span>{following ? "Following" : "Follow"}</span>
    </button>
  );
};
export default FollowBtn;
