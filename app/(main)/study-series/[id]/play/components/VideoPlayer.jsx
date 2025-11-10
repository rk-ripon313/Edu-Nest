"use client";

import { updateLessonWatch } from "@/app/actions/lessonWatch.actions";
import { usePlay } from "@/context/PlayContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ studySeriesId }) => {
  const { currentLesson } = usePlay();
  const router = useRouter();

  const progressRef = useRef(currentLesson?.lastTime || 0);
  const lastUpdateTimeRef = useRef(Date.now());

  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(currentLesson?.duration || 0);

  // Detect window for SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") setHasWindow(true);
  }, []);

  // Reset state when lesson changes
  useEffect(() => {
    setStarted(false);
    setEnded(false);
    setDuration(currentLesson?.duration || 0);
    progressRef.current = currentLesson?.lastTime || 0;
  }, [currentLesson?._id]);

  // --- Start lesson tracking ---
  const handleOnStart = async () => {
    setStarted(true);
    try {
      await updateLessonWatch({
        studySeriesId,
        chapterId: currentLesson?.chapter,
        lessonId: currentLesson._id,
        state: "started",
        lastTime: progressRef.current || 0,
        duration,
      });
    } catch (err) {
      console.error("Lesson start failed:", err);
    }
  };

  // --- Auto update progress every 30 seconds ---
  const handleOnProgress = async ({ playedSeconds }) => {
    if (!duration || ended) return;
    if (playedSeconds == null) return;

    // Ensure current lesson exists (cross-lesson safety)
    if (!currentLesson?._id) return;

    if (playedSeconds >= duration - 1) {
      setEnded(true);
      return;
    }

    const now = Date.now();
    if (now - lastUpdateTimeRef.current >= 30000) {
      lastUpdateTimeRef.current = now;
      progressRef.current = Math.floor(playedSeconds);

      try {
        await updateLessonWatch({
          studySeriesId,
          chapterId: currentLesson?.chapter,
          lessonId: currentLesson._id,
          state: "in-progress",
          lastTime: playedSeconds,
        });
      } catch (err) {
        console.error("Progress update failed:", err);
      }
    }
  };

  // --- Completed handler ---
  const handleOnEnded = async () => {
    setEnded(true);
    try {
      await updateLessonWatch({
        studySeriesId,
        chapterId: currentLesson?.chapter,
        lessonId: currentLesson._id,
        state: "completed",
        lastTime: duration,
      });
      // setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      console.error("Lesson complete failed:", err);
    }
  };

  const handleOnDuration = (dur) => setDuration(dur);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden relative">
      {hasWindow && currentLesson?.videoUrl ? (
        <div className="relative w-full pb-[56.25%] h-[70vh]">
          <ReactPlayer
            key={currentLesson._id}
            src={currentLesson.videoUrl}
            controls
            playing={started && !ended}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            onStart={handleOnStart}
            onProgress={handleOnProgress}
            onDuration={handleOnDuration}
            onEnded={handleOnEnded}
            progressInterval={1000} //  ensure frequent progress updates
            onReady={(player) => {
              if (progressRef.current > 0) {
                player.seekTo(progressRef.current, "seconds");
              }
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] text-white p-6">
          No video available
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
