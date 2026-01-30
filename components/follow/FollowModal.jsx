"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowListItem from "./FollowListItem";

const FollowModal = ({ open, setOpen, defaultTab, followers, following }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md  min-h-[260px] max-h-[70vh] flex flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100  rounded-lg border border-border shadow-lg">
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
            {followers?.length ? (
              followers.map((u) => (
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
            {following?.length ? (
              following.map((u) => (
                <FollowListItem key={u._id} user={u} type="following" />
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
