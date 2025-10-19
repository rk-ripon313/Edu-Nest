"use client";
import { deleteChapter, updateChapter } from "@/app/actions/chapter.actions";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EyeOff,
  Lock,
  MoreHorizontal,
  Trash,
  Unlock,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import ChapterEditorDialog from "./ChapterEditorDialog";

const ChapterQuickActions = ({ chapter, studySeriesId }) => {
  // Toggle access (lock/unlock)
  const handleAccessToggle = async (e) => {
    try {
      e.stopPropagation();
      const updatedData = { access: !chapter.access };
      const res = await updateChapter(chapter._id, updatedData);
      if (res.success) {
        toast.success(`Chapter ${updatedData.access ? "Unlocked" : "Locked"}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  // Toggle publish status
  const handlePublishToggle = async (e) => {
    try {
      e.stopPropagation();
      const updatedData = { isPublished: !chapter.isPublished };
      const res = await updateChapter(chapter._id, updatedData);
      if (res.success) {
        toast.success(
          `Chapter ${updatedData.isPublished ? "Published" : "Unpublished"}`
        );
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  //Delate  Chapter
  const handleDelete = async (e) => {
    try {
      e.stopPropagation();

      const res = await deleteChapter(chapter._id);
      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "something went rong");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ChapterEditorDialog chapter={chapter} studySeriesId={studySeriesId} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" title="More Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 z-20 bg-white dark:bg-slate-950 ">
          <DropdownMenuItem onClick={handleAccessToggle}>
            {chapter.access ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Lock
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" /> Unlock
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handlePublishToggle}>
            {chapter.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> Unpublish
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Publish
              </>
            )}
          </DropdownMenuItem>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-full py-1 rounded-md ps-2 flex items-center gap-2 text-red-700 hover:bg-red-300 transition-all cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash className=" mr-2 h-4 w-4" />
                <span>Delete</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this Chapter?</AlertDialogTitle>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ChapterQuickActions;
