"use client";

import Empty from "@/components/Empty";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip } from "lucide-react";
import { useEffect, useState } from "react";
import ChapterEditorDialog from "./ChapterEditorDialog";
import ChapterQuickActions from "./ChapterQuickActions";
import LessonList from "./LessonList";

const SeriesCurriculumTab = ({
  chapters = [],
  title = "Curriculum Manager",
  studySeriesId,
}) => {
  // Local state for chapters
  const [chapterList, setChapterList] = useState(chapters);

  // Sync with fresh props whenever chapters prop changes
  useEffect(() => {
    setChapterList(chapters);
  }, [chapters]);

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
  };

  return (
    <div className="min-h-[70vh] bg-background border rounded-lg ">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <ChapterEditorDialog studySeriesId={studySeriesId} />
      </div>

      {/* Chapter List */}
      {chapterList.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-chapters" type="CHAPTER">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4 p-6"
              >
                {chapterList.map((chapter, index) => {
                  const chapterId = chapter._id.toString();
                  return (
                    <Draggable
                      key={chapterId}
                      draggableId={chapterId}
                      index={index}
                    >
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="bg-white dark:bg-slate-950 border rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue={index === 0 ? chapterId : ""}
                            className="rounded-md"
                          >
                            <AccordionItem value={chapterId}>
                              {/* Chapter Header */}
                              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 dark:hover:bg-gray-800 rounded-l-md"
                                      {...prov.dragHandleProps}
                                    >
                                      <Grip className="h-5 w-5" />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <h3 className="font-medium text-sm md:text-base">
                                        {chapter.title}
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                                            chapter.isPublished
                                              ? "bg-green-50 text-green-700 border border-green-200"
                                              : "bg-amber-50 text-amber-700 border border-amber-200"
                                          }`}
                                        >
                                          {chapter.isPublished
                                            ? "Published"
                                            : "Draft"}
                                        </span>
                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                                            chapter.access
                                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                                              : "bg-red-50 text-red-700 border border-red-200"
                                          }`}
                                        >
                                          {chapter.access
                                            ? "Unlocked"
                                            : "Locked"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Chapter quick actions */}
                                  <ChapterQuickActions
                                    chapter={chapter}
                                    studySeriesId={studySeriesId}
                                  />
                                </div>
                              </AccordionTrigger>

                              {/* Lessons List */}
                              <LessonList
                                lessons={chapter?.lessonIds}
                                chapterId={chapterId}
                              />
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Empty title="No chapters added yet." />
      )}
    </div>
  );
};

export default SeriesCurriculumTab;
