"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect } from "react";

const LikesListModal = ({ open, onClose, likers = [] }) => {
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md rounded-xl p-0 bg-slate-50 dark:bg-slate-950">
        <DialogHeader className=" p-4">
          <DialogTitle className="text-lg font-semibold">
            People who loved this
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {likers?.length || 0} {likers?.length === 1 ? "person" : "people"}
            {" love this"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          {likers?.length === 0 && (
            <p className="text-center text-gray-500 py-6">No Loves Yet</p>
          )}

          {likers?.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <div className="w-10 h-10 relative mr-3">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover border-2 border-indigo-500"
                />
              </div>

              <div>
                <p className="font-medium">
                  {user.firstName
                    ? `${user?.firstName} ${user?.lastName}`
                    : user?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikesListModal;
