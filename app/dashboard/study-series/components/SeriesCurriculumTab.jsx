"use client";

import { reOrderChapters } from "@/app/actions/chapter.actions";
import Empty from "@/components/Empty";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  const router = useRouter();

  // Sync with fresh props whenever chapters prop changes
  useEffect(() => {
    setChapterList(chapters);
  }, [chapters]);

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(chapterList);
    const [removed] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, removed);

    const startIndex = Math.min(source.index, destination.index);
    const endIndex = Math.max(source.index, destination.index);

    const updatedChapters = reordered.slice(startIndex, endIndex + 1);

    setChapterList(reordered);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter._id,
      position: reordered.findIndex((item) => item._id === chapter._id) + 1, //  convert 0-based to 1-based
    }));

    // call server action
    try {
      const res = await reOrderChapters(bulkUpdateData, studySeriesId);
      if (res?.success) {
        toast.success(res.message || "Chapter order updated!");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update chapter order");
      }
    } catch (error) {
      toast.error("Failed to update chapter order");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <ChapterEditorDialog studySeriesId={studySeriesId} />
      </div>

      {/* Chapter List */}
      <div className="p-3 border rounded-lg overflow-x-hidden overflow-y-auto ">
        {chapterList.length ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-chapters" type="CHAPTER">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  // className="p-6"
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
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue={index === 0 ? chapterId : ""}
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            className="my-3 overflow-hidden bg-white dark:bg-slate-950 border rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <AccordionItem
                              value={chapterId}
                              className="p-4 overflow-hidden"
                            >
                              {/*Chapter Header AccordionTrigger wrapper */}
                              <div className="relative w-full">
                                <AccordionTrigger className="px-4 py-2 w-full flex items-center gap-3 hover:no-underline">
                                  {/* Left side: Drag handle + Title + Badges */}
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                      className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 dark:hover:bg-gray-800 rounded-l-md"
                                      {...prov.dragHandleProps}
                                    >
                                      <Grip className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                                      <h3 className="font-medium text-sm md:text-base truncate">
                                        {chapter.title}
                                      </h3>

                                      <div className="flex items-center gap-2 flex-wrap">
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
                                </AccordionTrigger>

                                {/* Right side: QuickActions absolute */}
                                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                  <ChapterQuickActions
                                    chapter={chapter}
                                    studySeriesId={studySeriesId}
                                  />
                                </div>
                              </div>

                              {/* Lessons List */}
                              <LessonList
                                lessons={chapter?.lessonIds}
                                chapterId={chapterId}
                              />
                            </AccordionItem>
                          </Accordion>
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
    </>
  );
};

export default SeriesCurriculumTab;
