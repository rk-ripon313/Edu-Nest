"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PlayBtn from "./PlayBtn";

const ChapterList = ({ chapters }) => {
  return (
    <div className="h-[70vh] overflow-y-auto p-2 mb-1">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        defaultValue={chapters?.[0]?._id}
      >
        {chapters.map((lessons) => (
          <AccordionItem
            key={lessons._id}
            value={lessons._id}
            className="border rounded-lg shadow-sm"
          >
            <AccordionTrigger className="px-4 py-2 font-semibold text-sm bg-muted hover:bg-muted/70 dark:bg-slate-950 rounded-t-lg">
              {lessons.title}
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
