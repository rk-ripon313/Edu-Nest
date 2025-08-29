"use client";

import { updateLessonWatch } from "@/app/actions/lessonWatch.actions";
import { usePlay } from "@/context/PlayContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ studySeriesId }) => {
  const { currentLesson } = usePlay();
  const router = useRouter();
  const progressRef = useRef(0);

  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") setHasWindow(true);
  }, []);

  // --- Lesson Start ---
  useEffect(() => {
    if (!started) return;

    const startLesson = async () => {
      try {
        await updateLessonWatch({
          studySeriesId,
          chapterId: currentLesson?.chapter,
          lessonId: currentLesson._id,
          state: "started",
          lastTime: 0,
          duration: currentLesson.duration,
        });
        setStarted(false);
      } catch (err) {
        console.error("Lesson start failed:", err);
      }
    };

    startLesson();
  }, [started, studySeriesId, currentLesson]);

  // --- Lesson Completed ---
  useEffect(() => {
    if (!ended) return;

    const completeLesson = async () => {
      try {
        await updateLessonWatch({
          studySeriesId,
          chapterId: currentLesson?.chapter,
          lessonId: currentLesson._id,
          state: "completed",
          lastTime: duration,
        });
        setEnded(false);
        router.refresh();
      } catch (err) {
        console.error("Lesson complete failed:", err);
      }
    };

    completeLesson();
  }, [ended, duration, currentLesson, studySeriesId, router]);

  // --- Progress Update every 30 seconds ---
  const handleOnProgress = async ({ playedSeconds }) => {
    if (!duration || ended) return;
    if (playedSeconds >= duration - 1) {
      setEnded(true);
      return;
    }
    const now = Date.now();
    // call after  evry  30s
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
          duration,
        });
      } catch (err) {
        console.error("Progress update failed:", err);
      }
    }
  };

  const handleOnStart = () => setStarted(true);
  const handleOnEnded = () => setEnded(true);
  const handleOnDuration = (dur) => setDuration(dur);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {hasWindow && currentLesson?.videoUrl ? (
        <div className="relative w-full pb-[56.25%] h-[70vh]">
          <ReactPlayer
            src={currentLesson.videoUrl}
            controls
            playing
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            onStart={handleOnStart}
            onDuration={handleOnDuration}
            onProgress={handleOnProgress}
            onEnded={handleOnEnded}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] text-white p-6">
          📺 Please select a video
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
