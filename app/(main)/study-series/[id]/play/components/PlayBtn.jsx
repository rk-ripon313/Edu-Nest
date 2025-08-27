"use client";
import { usePlay } from "@/context/PlayContext";
import { CheckCircle, Circle, Lock } from "lucide-react";

const PlayBtn = ({ lesson }) => {
  const { currentLesson, setCurrentLesson } = usePlay();

  const isActive = currentLesson?._id?.toString() === lesson._id.toString();

  return (
    <button
      onClick={() => setCurrentLesson(lesson)}
      disabled={!lesson?.access}
      className={`flex items-center w-full text-left px-3 py-2 rounded-md transition ${
        isActive
          ? "bg-primary text-white shadow"
          : "hover:bg-muted dark:hover:bg-slate-950 text-gray-700 dark:text-gray-300"
      }`}
    >
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
    </button>
  );
};

export default PlayBtn;
