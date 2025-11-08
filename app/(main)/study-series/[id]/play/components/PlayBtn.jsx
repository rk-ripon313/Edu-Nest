"use client";
import { usePlay } from "@/context/PlayContext";
import { formatDuration } from "@/lib/formetData";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const PlayBtn = ({ lesson }) => {
  const { currentLesson, setCurrentLesson } = usePlay();
  const router = useRouter();
  const isActive = currentLesson?._id?.toString() === lesson._id.toString();

  return (
    <button
      onClick={() =>
        setCurrentLesson({
          ...lesson, // flatten all lesson fields
          lastTime: 0,
          state: "not-started",
          duration: lesson.duration,
        })
      }
      disabled={!lesson?.access}
      className={`flex items-center w-full justify-between px-3 py-2 rounded-md transition ${
        isActive
          ? "bg-primary text-white shadow"
          : "hover:bg-muted dark:hover:bg-slate-950 text-gray-700 dark:text-gray-300 disabled:text-opacity-80"
      }`}
    >
      <div className="flex items-center text-left">
        {lesson?.access ? (
          <>
            {lesson?.completed ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 mr-2 text-gray-400" />
            )}
          </>
        ) : (
          <Lock className="w-4 h-4 mr-2 text-gray-400" />
        )}
        <span className="truncate">{lesson.title}</span>
      </div>
      <span> {formatDuration(lesson?.duration)}</span>
    </button>
  );
};

export default PlayBtn;
