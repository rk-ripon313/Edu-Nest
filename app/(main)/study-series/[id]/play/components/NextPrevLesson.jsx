"use client";
import { Button } from "@/components/ui/button";
import { usePlay } from "@/context/PlayContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NextPrevLesson = () => {
  const { goNextLesson, goPrevLesson, canGoNext, canGoPrev, currentLesson } =
    usePlay();

  if (!currentLesson) return null;

  return (
    <div className="flex justify-between items-center mt-2 px-2">
      <Button variant="secondary" disabled={!canGoPrev} onClick={goPrevLesson}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>

      <Button variant="secondary" disabled={!canGoNext} onClick={goNextLesson}>
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default NextPrevLesson;
