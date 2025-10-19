"use client";

import { createChapter, updateChapter } from "@/app/actions/chapter.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

//  Zod validation schema
const chapterSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be under 30 characters"),
  description: z
    .string()
    .max(200, "Description must be under 200 characters")
    .optional(),
  access: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

const ChapterEditorDialog = ({ chapter, studySeriesId }) => {
  const isEdit = !!chapter;
  const [open, setOpen] = useState(false);

  const router = useRouter();

  //  Hook Form Setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      description: "",
      access: false,
      isPublished: false,
    },
  });

  //  Load data when editing
  useEffect(() => {
    if (chapter) {
      reset({
        title: chapter.title || "",
        description: chapter.description || "",
        access: chapter.access || false,
        isPublished: chapter.isPublished || false,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data) => {
    try {
      const res = isEdit
        ? await updateChapter(chapter._id, data)
        : await createChapter(data, studySeriesId);

      if (res.success) {
        toast.success(res?.message);
        reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message || "Something went rong");
    }
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        size={isEdit ? "icon" : "default"}
        variant={isEdit ? "ghost" : "default"}
        className={isEdit ? "" : "flex items-center gap-2"}
        title={isEdit ? "Edit Chapter" : "Add Chapter"}
      >
        {isEdit ? (
          <Pencil className="h-4 w-4" />
        ) : (
          <>
            <Plus size={14} /> Add Chapter
          </>
        )}
      </Button>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md  bg-slate-200 dark:bg-slate-950 rounded-lg border border-border shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="font-grotesk font-semibold">
              {isEdit ? "Edit Chapter" : "Add New Chapter"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details of this chapter."
                : "Fill out the details to create a new chapter."}
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Enter chapter title"
                {...register("title")}
                className=" bg-light_bg dark:bg-dark_bg"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter a short description"
                {...register("description")}
                className="border rounded px-2 py-1 resize-none bg-light_bg dark:bg-dark_bg"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Access Switch */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex flex-col">
                <Label>Access Control</Label>
                <p className="text-xs text-muted-foreground">
                  {watch("access") ? "Unlocked for students" : "Locked"}
                </p>
              </div>
              <Switch
                checked={watch("access")}
                onCheckedChange={(val) => setValue("access", val)}
              />
            </div>

            {/* Publish Switch */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label>Publish Status</Label>
                <p className="text-xs text-muted-foreground">
                  {watch("isPublished") ? "Published" : "Draft mode"}
                </p>
              </div>
              <Switch
                checked={watch("isPublished")}
                onCheckedChange={(val) => setValue("isPublished", val)}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isEdit ? "Save Changes" : "Create Chapter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChapterEditorDialog;
