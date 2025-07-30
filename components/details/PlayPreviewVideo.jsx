"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";

const PlayPreviewVideo = ({ videoUrl }) => {
  const [open, setOpen] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && open) {
      setHasWindow(true);
    } else {
      setHasWindow(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-accent px-1 text-xs rounded border border-border  cursor-pointer"
          onClick={() => setOpen(true)}
        >
          play
        </button>
      </DialogTrigger>

      {hasWindow && videoUrl && open && (
        <DialogContent className="max-w-3xl w-full aspect-video p-0 overflow-hidden">
          <DialogTitle className="sr-only">Video Preview</DialogTitle>
          <DialogDescription className="sr-only">
            A dialog containing the preview video player.
          </DialogDescription>
          <div className="relative w-full h-0 pb-[56.25%] rounded-md ">
            <ReactPlayer
              src={videoUrl}
              playing={open}
              controls
              // light
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 z-50 p-2 rounded-full bg-black shadow-md hover:bg-destructive  transition-all"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5 text-white hover:rotate-90" />
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PlayPreviewVideo;
