"use client";

import { createLesson, updateLesson } from "@/app/actions/lesson.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/Spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileToCloudinary } from "@/lib/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { toast } from "sonner";
import { z } from "zod";
//  form validation
const lessonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be under 30 characters"),
  description: z.string().optional(),
  isPreview: z.boolean(),
  isPublished: z.boolean(),
});

const LessonEditorDialog = ({
  open,
  onClose,
  chapterId,
  lesson = null,
  onSaved,
}) => {
  const isEditMode = !!lesson;

  //  Video upload states
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(lesson?.videoUrl || null);
  const [duration, setDuration] = useState(lesson?.duration || 0);

  //  Resource states
  const [resources, setResources] = useState(lesson?.resources || []);
  const [newResource, setNewResource] = useState({ title: "", url: "" });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      isPreview: lesson?.isPreview || false,
      isPublished: lesson?.isPublished || false,
    },
  });

  //  Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: 1,
    disabled: isEditMode, // disable in edit mode

    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];

      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
      //Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Video size must be under 20MB");
        return;
      }

      // revoke previous blob URL safely
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setVideoFile(file);

      // create new blob URL for preview
      const fileUrl = URL.createObjectURL(file);
      setVideoPreview(fileUrl);

      // create temp video to extract duration
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = fileUrl;

      tempVideo.onloadedmetadata = () => {
        setDuration(Math.floor(tempVideo.duration));
        // detach temp video src
        tempVideo.src = "";
      };
    },
  });

  //  Add new resource
  const handleAddResource = () => {
    const { title, url } = newResource;
    if (!title.trim() || !url.trim())
      return toast.error("Fill both title & URL");
    if (title.length > 10) return toast.error("Title max 10 chars");
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    if (!urlPattern.test(url)) return toast.error("Enter valid URL");

    setResources([...resources, newResource]);
    setNewResource({ title: "", url: "" });
  };
  //  Remove resource
  const removeResource = (idx) =>
    setResources(resources.filter((_, i) => i !== idx));

  // Handle Form Submit...
  const onSubmit = async (data) => {
    try {
      if (!isEditMode && !videoFile) return toast.error("Video is required");

      let res = {};

      if (isEditMode) {
        res = await updateLesson({ ...data, resources, lessonId: lesson._id });
      } else {
        // const formData = new FormData(); //formData.append("file", videoFile); //formData.append("title", title);
        // Upload to external API
        // const uploadRes = await fetch("/api/upload-youtube", { method: "POST",body: formData});
        // const uploadRes = await fetch("https://upload-youtube.vercel.app/", {method: "POST",body: formData,});

        const videoUrl = await uploadFileToCloudinary(
          videoFile,
          "video",
          "series"
        );
        if (!videoUrl) return toast.error("Video upload failed!");

        res = await createLesson({
          data,
          resources,
          duration,
          videoUrl,
          chapterId,
        });
      }

      // RESPONSE HANDLING
      if (res.success) {
        toast.success(res?.message);
        reset();
        setResources([]);
        setVideoFile(null);
        setVideoPreview(null);
        setDuration(0);
        onSaved();
      } else toast.error(res.message);
    } catch (error) {
      toast.error(error?.message || "Failed!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" max-w-5xl w-full bg-slate-50 dark:bg-slate-950 px-6 sm:px-10 overflow-y-auto max-h-[95vh] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isEditMode ? "Edit Lesson" : "Add New Lesson"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update your lesson details below."
              : "Create a new lesson by filling out the form below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title + Description + isPreview + isPublished */}
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input {...register("title")} placeholder="Lesson title..." />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Enter  lesson description"
                  rows={3}
                  className=" resize-none "
                />{" "}
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex  items-start  gap-4 pt-2">
                <Label className="flex items-center gap-2">
                  <span>Preview</span>

                  <Switch
                    checked={watch("isPreview")}
                    onCheckedChange={(val) => setValue("isPreview", val)}
                  />
                </Label>
                <Label className="flex items-center gap-2">
                  <span>Published</span>

                  <Switch
                    checked={watch("isPublished")}
                    onCheckedChange={(val) => setValue("isPublished", val)}
                  />
                </Label>
              </div>
            </div>

            {/*  Video Upload */}
            <div>
              <Label>Lesson Video</Label>
              {!isEditMode ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex items-center justify-center min-h-[200px] ${
                    isDragActive
                      ? "border-green-500 bg-green-50 dark:bg-black"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <input {...getInputProps()} />
                  {videoPreview ? (
                    <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-lg shadow">
                      <video
                        src={videoPreview}
                        controls
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {isDragActive
                        ? "Drop the video here ..."
                        : "Drag & drop a video file here, or click to select"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="min-h-[200px]">
                  <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-lg shadow">
                    <ReactPlayer
                      src={videoPreview}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        file: { attributes: { tabIndex: -1 } },
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    🎬 Original content cannot be changed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/*  Resources */}
          <div>
            <Label className="mb-2 block font-medium">Resources</Label>

            {/* New Resource Input */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Resource Title"
                value={newResource.title}
                onChange={(e) =>
                  setNewResource({ ...newResource, title: e.target.value })
                }
              />
              <Input
                placeholder="Resource URL"
                value={newResource.url}
                onChange={(e) =>
                  setNewResource({ ...newResource, url: e.target.value })
                }
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddResource}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Added Resources List */}
            {resources.length > 0 ? (
              <ol className="flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                {resources.map((res, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4 justify-between">
                      <strong className="text-green-600">
                        {res.title}
                        {""} : {""}
                      </strong>
                      <span>{res.url}</span>
                    </div>

                    <Trash
                      size={16}
                      className="text-red-600 cursor-pointer"
                      onClick={() => removeResource(idx)}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm italic border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-3 text-center">
                No resources added yet.
              </p>
            )}
          </div>

          {/*  Actions */}
          <div className="flex justify-end gap-4 pt-2.5">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-green-600 text-white disabled:bg-green-300 disabled:hover:bg-none
              outline-1 disabled:outline-red-500 font-semibold font-sora"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner className="ml-2" />}{" "}
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditorDialog;
