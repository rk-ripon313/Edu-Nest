"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const BlogModal = ({ children, blogTitle }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open={true} modal className="">
      <DialogContent
        hideCloseButton
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={handleClose}
        className="w-full max-w-3xl h-[95vh] !border-none !p-0  m-0 bg-white dark:bg-gray-800  rounded-xl shadow-2xl overflow-hidden flex flex-col gap-0"
      >
        {/* Header */}
        <div className="z-20 bg-slate-50 dark:bg-gray-900 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold truncate pr-10">
            {blogTitle || "Blog Post"}
          </h2>

          {/* Custom Close Button */}
          <DialogClose asChild>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-800 transition"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </DialogClose>
        </div>

        {/* Separator */}
        <Separator className="!m-0 !p-0 bg-gray-200 dark:bg-gray-600" />

        {/* Content */}
        <div
          className="flex-1  overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;
