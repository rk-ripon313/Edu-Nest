"use client";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Lock,
  Pencil,
  Play,
  Trash,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

const LessonQuickActions = ({ lesson = {} }) => {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Edit Lesson */}
      <Button
        size="icon"
        variant="ghost"
        title="Edit Lesson"
        className="hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      {/* Publish / Unpublish */}
      <Button
        size="icon"
        variant="ghost"
        title={lesson.isPublished ? "Unpublish Lesson" : "Publish Lesson"}
        className="hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {lesson.isPublished ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <UploadCloud className="h-4 w-4 text-blue-500" />
        )}
      </Button>

      {/* Preview toggle */}
      <Button
        size="icon"
        variant="ghost"
        title={lesson.isPreview ? "Disable Preview" : "Enable Preview"}
        className="hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {lesson.isPreview ? (
          <Play className="h-4 w-4 text-green-400" />
        ) : (
          <Lock className="h-4 w-4 text-gray-400" />
        )}
      </Button>

      {/* Delete Lesson */}
      <Button
        size="icon"
        variant="ghost"
        title="Delete Lesson"
        className="hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={() => toast.message("del")}
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};
export default LessonQuickActions;
