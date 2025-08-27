"use client";
import { usePlay } from "@/context/PlayContext";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const { currentLesson } = usePlay();
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {/* ---- Video Section ---- */}
      {hasWindow && currentLesson?.videoUrl ? (
        <div className="relative w-full pb-[56.25%] min-h-[300px]">
          <ReactPlayer
            src={currentLesson.videoUrl}
            controls
            playing
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[300px] text-white p-6">
          📺 Please select a video
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
