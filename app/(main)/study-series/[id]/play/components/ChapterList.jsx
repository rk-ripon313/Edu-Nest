"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlay } from "@/context/PlayContext";
import { useEffect, useState } from "react";
import PlayBtn from "./PlayBtn";

const ChapterList = ({ chapters }) => {
  const { currentLesson } = usePlay();

  //  Maintain which chapter is open
  const [openChapter, setOpenChapter] = useState(
    currentLesson?.chapter || chapters?.[0]?._id
  );

  //  When currentLesson changes, auto-open its parent chapter
  useEffect(() => {
    if (currentLesson?.chapter) {
      setOpenChapter(currentLesson.chapter);
    }
  }, [currentLesson?.chapter]);

  return (
    <div className="h-[70vh] overflow-y-auto p-2 mb-1">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        value={openChapter}
        onValueChange={setOpenChapter}
      >
        {chapters.map((lessons) => (
          <AccordionItem
            key={lessons._id}
            value={lessons._id}
            className="border rounded-lg shadow-sm"
          >
            <AccordionTrigger className="px-4 py-2 font-semibold text-sm bg-muted hover:bg-muted/70 dark:bg-slate-950 rounded-t-lg">
              <div className="flex items-center justify-between w-full">
                <span>{lessons.title}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {lessons.completedLessons}/{lessons.totalLessons}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="space-y-1 px-2 py-2">
              {lessons?.lessonIds?.map((lesson) => (
                <PlayBtn key={lesson._id} lesson={lesson} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ChapterList;
