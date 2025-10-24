"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/formetData";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AddLessonModal from "./LessonEditorDialog";
import LessonQuickActions from "./LessonQuickActions";

const LessonList = ({ lessons, chapterId }) => {
  const hasLessons = lessons && lessons.length > 0;

  const router = useRouter();
  const [openLessonDialog, setOpenLessonDialog] = useState(false);

  //close the lessonModal fn
  const onClose = () => setOpenLessonDialog(false);
  const onSaved = () => {
    setOpenLessonDialog(false);
    router.refresh();
  };

  const onLessonDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    //  reOrderLessons()
    toast.message("Lesson reordered within chapter:");
  };

  return (
    <AccordionContent className="bg-slate-50 dark:bg-slate-900 rounded-b-lg transition-all">
      {hasLessons ? (
        <>
          <DragDropContext onDragEnd={onLessonDragEnd}>
            <Droppable droppableId={chapterId} type="LESSON">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-3 space-y-2"
                >
                  {lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson._id}
                      draggableId={lesson._id}
                      index={index}
                    >
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3  p-3 bg-white dark:bg-slate-800
                           border border-slate-200 dark:border-slate-700  rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                        >
                          {/* Left side: drag  info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-grab"
                              {...prov.dragHandleProps}
                            >
                              <Grip className="h-4 w-4 opacity-70" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-sm md:text-base truncate">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.duration
                                  ? formatDuration(lesson.duration) + " H"
                                  : "No duration"}{" "}
                                {lesson.isPreview && "• Preview"}
                              </p>
                            </div>

                            {lesson.isPublished && (
                              <Badge className="text-xs text-white px-1 py-0.5">
                                Published
                              </Badge>
                            )}
                          </div>

                          {/* Right side: status  actions */}
                          <LessonQuickActions
                            lesson={lesson}
                            onSaved={onSaved}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* add new lesson */}
          <Button
            onClick={() => setOpenLessonDialog(true)}
            className="bg-accent hover:bg-green-600 text-white transition-all hover:scale-x-105 my-3 mx-4 w-full sm:w-auto flex items-center gap-2"
          >
            <Plus size={14} /> Add Lesson
          </Button>

          {/* Add Lesson Modal */}
          <AddLessonModal
            open={openLessonDialog}
            onClose={onClose}
            chapterId={chapterId}
            onSaved={onSaved}
          />
        </>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <Button
            className="h-12 w-12 flex items-center justify-center mb-3 rounded-full bg-accent hover:bg-green-600  transition-all hover:scale-105 "
            onClick={() => setOpenLessonDialog(true)}
          >
            <Plus className="text-white" />
          </Button>
          <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">
            No lessons yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add your first lesson to this chapter.
          </p>
          <AddLessonModal
            open={openLessonDialog}
            onClose={onClose}
            chapterId={chapterId}
            onSaved={onSaved}
          />
        </div>
      )}
    </AccordionContent>
  );
};

export default LessonList;
