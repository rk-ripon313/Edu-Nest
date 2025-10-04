"use client";

import { deleteABook, updateABook } from "@/app/actions/boook.action";
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
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BookHeaderControls = ({ book }) => {
  const router = useRouter();

  const handleTogglePublish = async () => {
    try {
      const dbRes = await updateABook(book.id, {
        isPublished: !book?.isPublished,
      });

      if (dbRes.success) {
        toast.success(dbRes.message);
        router.refresh();
      } else {
        toast.error(dbRes.message);
      }
    } catch (error) {
      toast.error(error?.message || "Book Data Updated Failed!");
    }
  };

  const handleDelete = async () => {
    try {
      if (book?.isPublished) {
        toast.error("Unpublish the book before deleting.");
        return;
      }

      const dbRes = await deleteABook(book?.id);

      if (dbRes.success) {
        toast.success(dbRes.message);
        router.push("/dashboard/books");
        router.refresh();
      } else {
        toast.error(dbRes.message);
      }
    } catch (error) {
      toast.error(error?.message || " Failed!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Publish / Unpublish */}
      {book?.isPublished ? (
        //  Unpublish -> Confirmation dialog
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <EyeOff className="w-4 h-4 text-red-500" /> Unpublish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <AlertDialogHeader>
              <AlertDialogTitle>Unpublish this book?</AlertDialogTitle>
              <AlertDialogDescription>
                Students will no longer see this book in the library.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleTogglePublish}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        //  Publish -> No confirmation, direct action
        <Button
          onClick={handleTogglePublish}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Eye className="w-4 h-4 text-white" /> Publish
        </Button>
      )}

      {/* Delete Book  */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The book will be permanently
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
export default BookHeaderControls;
