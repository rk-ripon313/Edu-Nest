"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import FollowListItem from "./FollowListItem";

const FollowModal = ({ open, setOpen, defaultTab, followers, following }) => {
  const [localFollowers, setLocalFollowers] = useState([]);
  const [localFollowing, setLocalFollowing] = useState([]);

  //  server data → local state
  useEffect(() => {
    setLocalFollowers(followers || []);
    setLocalFollowing(following || []);
  }, [followers, following]);

  //  unfollow handler
  const handleUnfollow = (userId) => {
    setLocalFollowing((prev) =>
      prev.filter((u) => u._id.toString() !== userId),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-md  min-h-[260px] max-h-[70vh] flex flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100  rounded-lg border border-border shadow-lg"
      >
        <DialogHeader>
          <DialogTitle>Connections</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="">
          <TabsList className="mx-4 my-2 rounded-md shadow-sm bg-muted dark:bg-slate-800  ">
            <TabsTrigger
              value="followers"
              className="text-sm font-sora px-3 py-2 rounded-md transition-colors
                 data-[state=active]:bg-primary data-[state=active]:text-white
                 hover:bg-primary/20"
            >
              Followers
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="text-sm font-sora px-3 py-2 rounded-md transition-colors
                 data-[state=active]:bg-primary data-[state=active]:text-white
                 hover:bg-primary/20"
            >
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="followers"
            className="flex-1 overflow-y-auto px-2"
          >
            {localFollowers.length ? (
              localFollowers.map((u) => (
                <FollowListItem key={u._id} user={u} type="followers" />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No followers</p>
            )}
          </TabsContent>

          <TabsContent
            value="following"
            className="flex-1 overflow-y-auto px-2"
          >
            {localFollowing.length ? (
              localFollowing.map((u) => (
                <FollowListItem
                  key={u._id}
                  user={u}
                  type="following"
                  onUnfollow={handleUnfollow}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No following users
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
