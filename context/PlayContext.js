"use client";
import { createContext, useContext, useMemo, useState } from "react";

const PlayContext = createContext(null);

export const PlayProvider = ({ children, chapters, currentWatch }) => {
  // console.log({ currentWatch });

  const lessons = useMemo(() => {
    return chapters.flatMap((ch) => ch.lessonIds);
  }, [chapters]);

  //  Use currentWatch (DB) for initial state, flattened
  const [currentLesson, setCurrentLesson] = useState(() => {
    if (currentWatch) {
      return {
        ...currentWatch, // lastTime, state, duration, completed
        ...currentWatch.lesson, // flatten lesson fields
      };
    }

    // fallback to first lesson
    const firstLesson = chapters?.[0]?.lessonIds?.[0] || null;
    return firstLesson
      ? {
          ...firstLesson, // flatten lesson fields
          lastTime: 0,
          state: "not-started",
          completed: false,
        }
      : null;
  });
  // console.log({ currentLesson });

  const [progress, setProgress] = useState(0);

  return (
    <PlayContext.Provider
      value={{
        lessons,
        currentLesson,
        setCurrentLesson,
        progress,
        setProgress,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
};

export const usePlay = () => useContext(PlayContext);
