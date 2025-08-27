"use client";
import { createContext, useContext, useState } from "react";

const PlayContext = createContext(null);

export const PlayProvider = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  return (
    <PlayContext.Provider
      value={{ currentLesson, setCurrentLesson, progress, setProgress }}
    >
      {children}
    </PlayContext.Provider>
  );
};

export const usePlay = () => useContext(PlayContext);
