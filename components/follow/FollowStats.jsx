"use client";

import { useState } from "react";
import FollowModal from "./FollowModal";

const FollowStats = ({ followers, following }) => {
  const [open, setOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("followers");

  return (
    <>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
        <button
          onClick={() => {
            setDefaultTab("followers");
            setOpen(true);
          }}
        >
          <span className="font-semibold text-foreground">
            {followers?.length || 0}
          </span>{" "}
          Followers
        </button>

        <button
          onClick={() => {
            setDefaultTab("following");
            setOpen(true);
          }}
        >
          <span className="font-semibold text-foreground">
            {following?.length || 0}
          </span>{" "}
          Following
        </button>
      </div>

      <FollowModal
        open={open}
        setOpen={setOpen}
        defaultTab={defaultTab}
        followers={followers}
        following={following}
      />
    </>
  );
};

export default FollowStats;
