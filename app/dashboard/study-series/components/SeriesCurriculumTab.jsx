"use client";

import Empty from "@/components/Empty";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Plus } from "lucide-react";
import { useState } from "react";
import ChapterQuickActions from "./ChapterQuickActions";
import LessonList from "./LessonList";
const mockChapters = [
  {
    _id: "chap-1",
    title: "Introduction to Grammar",
    description: "Basic overview of grammar rules",
    isPublished: true,
    access: true,
    lessonIds: [
      {
        _id: "les-1",
        title: "What is Grammar?",
        duration: 6,
        isPublished: true,
        isPreview: true,
      },
      {
        _id: "les-2",
        title: "Parts of Speech",
        duration: 12,
        isPublished: false,
        isPreview: false,
      },
    ],
  },
  {
    _id: "chap-2",
    title: "Tenses Made Simple",
    description: "Understand tenses in depth",
    isPublished: false,
    access: false,
    lessonIds: [
      {
        _id: "les-3",
        title: "Present Tense",
        duration: 15,
        isPublished: true,
        isPreview: false,
      },
      {
        _id: "les-4",
        title: "Past Tense",
        duration: 10,
        isPublished: false,
        isPreview: false,
      },
    ],
  },
];

const SeriesCurriculumTab = ({
  title = "Curriculum Manager title ",
  studySeriesId,
}) => {
  const [chapters, setChapters] = useState(mockChapters);

  // reorder helper
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    const reordered = reorder(chapters, source.index, destination.index);
    setChapters(reordered);
  };

  return (
    <div className="min-h-[70vh] bg-background border rounded-lg overflow-hidden">
      {/* Header  Create a new chapter */}
      <div className="bg-white dark:bg-slate-950 flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button
          size="default"
          variant="ghost"
          className="flex items-center gap-2"
          title="Add Chapter"
        >
          <Plus size={14} /> Add Chapter
        </Button>
      </div>

      {/* Chapter List  */}

      {chapters.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-chapters" type="CHAPTER">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4 p-6"
              >
                {chapters.map((chapter, index) => {
                  //chapter id
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
                          className="bg-white dark:bg-slate-950 border rounded-lg shadow-sm"
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
                                      className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 dark:hover:bg-gray-800 rounded-l-md "
                                      {...prov.dragHandleProps}
                                    >
                                      <Grip className="h-5 w-5" />
                                    </div>
                                    {/* --Chapter basic info ----- */}
                                    <div className="flex flex-col gap-1">
                                      <h3 className="font-medium text-sm md:text-base">
                                        {chapter.title}
                                      </h3>

                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-md
                                         ${chapter.isPublished ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
                                        >
                                          {chapter.isPublished
                                            ? "Published"
                                            : "Draft"}
                                        </span>

                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-md
                                         ${chapter.access ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                                        >
                                          {chapter.access
                                            ? "Unlocked"
                                            : "Locked"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* chapter quick Actions */}
                                  <ChapterQuickActions
                                    chapter={chapter}
                                    studySeriesId={studySeriesId}
                                  />
                                </div>
                              </AccordionTrigger>

                              {/* Lessons List in AccordionContent */}
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
        <div>
          <Empty title={" No chapters added yet."} />
        </div>
      )}
    </div>
  );
};
export default SeriesCurriculumTab;
