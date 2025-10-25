"use client";
import { deleteLesson, updateLesson } from "@/app/actions/lesson.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Lock,
  Pencil,
  Play,
  Trash,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LessonEditorDialog from "./LessonEditorDialog";

const LessonQuickActions = ({ lesson }) => {
  const router = useRouter();
  const [openLessonDialog, setOpenLessonDialog] = useState(false);

  //close the lessonModal fn
  const onClose = () => setOpenLessonDialog(false);
  const onSaved = () => {
    setOpenLessonDialog(false);
    router.refresh();
  };

  // Toggle publish status
  const handlePublishToggle = async (e) => {
    try {
      const updatedData = {
        isPublished: !lesson.isPublished,
        lessonId: lesson._id,
      };

      const res = await updateLesson(updatedData);

      if (res.success) {
        toast.success(
          `Lesson ${updatedData.isPublished ? "Published" : "Unpublished"}`
        );
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  // Toggle Preview isPreview
  const handlePreviewToggle = async (e) => {
    try {
      const updatedData = {
        isPreview: !lesson.isPreview,
        lessonId: lesson._id,
      };

      const res = await updateLesson(updatedData);
      if (res.success) {
        toast.success(
          `Lesson ${updatedData.isPreview ? "set as preview" : "preview disabled"}`
        );
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  //Delate  lesson
  const handleDelete = async (e) => {
    try {
      const res = await deleteLesson(lesson._id);
      if (res.success) {
        toast.success(res?.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Edit Lesson */}
      <Button
        onClick={() => setOpenLessonDialog(true)}
        size="icon"
        variant="ghost"
        title="Edit Lesson"
        className="hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {openLessonDialog && (
        <LessonEditorDialog
          lesson={lesson}
          open={openLessonDialog}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}

      {/* Publish / Unpublish */}
      <Button
        onClick={handlePublishToggle}
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
        onClick={handlePreviewToggle}
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            title="Delete Lesson"
            className="hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this Lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The Chapter will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default LessonQuickActions;
