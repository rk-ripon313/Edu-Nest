"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { EyeOff, Grip, Pencil, Plus, Trash, Upload } from "lucide-react";

const LessonList = ({ lessons, chapterId }) => {
  return (
    <AccordionContent>
      {lessons?.length ? (
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
                      className="flex items-center justify-between bg-light_bg dark:bg-dark_bg border rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-l-md hover:shadow-md hover:scale-105"
                          {...prov.dragHandleProps}
                        >
                          <Grip className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-500">
                            {lesson.duration} min{" "}
                            {lesson.isPreview && "• Preview"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lesson.isPublished ? (
                          <Badge>Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                        <Button size="icon" variant="ghost" title="Edit Lesson">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Publish/Unpublish"
                        >
                          {lesson.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="icon" variant="ghost" title="Delete">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        <div>no lesson avilabe !</div>
      )}

      <div className="px-3 pb-4">
        <Button variant="outline" className="mt-2 flex items-center gap-2">
          <Plus size={14} /> Add Lesson
        </Button>
      </div>
    </AccordionContent>
  );
};
export default LessonList;
