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
      const { lesson, ...watchRest } = currentWatch;
      return { ...watchRest, ...lesson };
    }
    return lessons?.[0] || null; // fallback to first lesson
  });
  //console.log({ currentLesson });

  //  Find current index efficiently
  const currentIndex = useMemo(() => {
    return lessons.findIndex((l) => l._id === currentLesson?._id);
  }, [lessons, currentLesson?._id]);

  //  Compute navigation availability
  const canGoNext = currentIndex < lessons.length - 1;
  const canGoPrev = currentIndex > 0;

  //  Next lesson handler
  const goNextLesson = () => {
    if (canGoNext) setCurrentLesson(lessons[currentIndex + 1]);
  };

  // Previous lesson handler
  const goPrevLesson = () => {
    if (canGoPrev) setCurrentLesson(lessons[currentIndex - 1]);
  };

  const [progress, setProgress] = useState(0);

  return (
    <PlayContext.Provider
      value={{
        lessons,
        currentLesson,
        setCurrentLesson,
        progress,
        setProgress,
        canGoNext,
        canGoPrev,
        currentIndex,
        goPrevLesson,
        goNextLesson,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
};

export const usePlay = () => useContext(PlayContext);
