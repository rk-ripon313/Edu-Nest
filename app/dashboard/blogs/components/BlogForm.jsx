"use client";

import { createBlog, updateBlog } from "@/app/actions/blog.actions";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileToCloudinary } from "@/lib/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { Trash2Icon, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";

// Dynamic import for Quill Editor (ensures it loads client-side)
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z.string().max(300, "Maximum 300 characters"),
  content: z.string().refine(
    (val) => {
      const cleaned = val.replace(/<[^>]+>/g, "").trim();
      return cleaned.length >= 10;
    },
    { message: "Content must be at least 10 characters of actual text" }
  ),
  status: z.enum(["published", "private"]).default("published"),
  tags: z.string().optional(),
});

const BlogForm = ({ blogId, initialData }) => {
  const isEdit = blogId;
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      content: initialData?.content || "",
      status: initialData?.status || "published",
    },
  });

  useEffect(() => {
    if (initialData) {
      if (initialData?.images?.length > 0) {
        setImages(
          initialData.images.map((url) => ({
            file: null,
            url,
          }))
        );
        setTags(initialData?.tags);
      }
    }
  }, [initialData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      acceptedFiles.forEach(async (file) => {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          });
          setImages((prev) => [
            ...prev,
            { file: compressed, url: URL.createObjectURL(compressed) },
          ]);
        } catch (err) {
          console.error(err);
        }
      });
    },
  });

  //remove an image from images array
  const handleDeleteImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (currentIndex >= updated.length && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      return updated;
    });
  };

  // open gallery modal
  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  // Tags
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tagInput.length < 2) {
      toast.error("Tag must be at least 2 characters");
      return;
    }
    if (tagInput.length > 30) {
      toast.error("Tag cannot exceed 30 characters");
      return;
    }
    if (tags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (i) => {
    setTags(tags.filter((_, idx) => idx !== i));
  };

  //handle submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      //  Old URLs
      const existingImageUrls = images
        .filter((item) => item.url && !item.file)
        .map((item) => item.url);

      //  New files
      const newImageFiles = images
        .filter((item) => item.file)
        .map((item) => item.file);

      //  Upload new images
      let uploadedImageUrls = newImageFiles.length
        ? await uploadFileToCloudinary(newImageFiles, "image", "blogs")
        : [];

      // Ensure response is always an array (normalize Cloudinary output)
      if (!Array.isArray(uploadedImageUrls)) {
        uploadedImageUrls = [uploadedImageUrls];
      }

      // Combine old & newly uploaded image URLs
      const finalImageArray = [...existingImageUrls, ...uploadedImageUrls];

      // ------------------------
      // Handle here Create and Edit Server Actions
      // ------------------------
      let res;

      if (isEdit) {
        // update blog
        res = await updateBlog(blogId, {
          ...data,
          tags,
          images: finalImageArray,
        });
      } else {
        // create blog
        res = await createBlog({
          ...data,
          tags,
          images: finalImageArray,
        });
      }

      if (!res?.success) {
        toast.error(
          res?.message ||
            (isEdit ? "Blog update failed" : "Blog creation failed")
        );
        return;
      }

      toast.success(res?.message || (isEdit ? "Blog updated" : "Blog created"));

      reset();
      setTags([]);
      router.push("/dashboard/blogs");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 shadow-lg rounded-lg bg-white dark:bg-slate-950 space-y-6"
      >
        {/* header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit Blog" : "Create Blog"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Fill necessary details and images. Images are uploaded to Cloud.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm mr-2">Private</span>
            <Switch
              checked={watch("status") === "published"}
              onCheckedChange={(val) =>
                setValue("status", val ? "published" : "private", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <span className="text-sm ml-2">Published</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label> Blog Title</Label>
          <Input {...register("title")} placeholder="Enter an engaging title" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label>Short Description</Label>
          <Textarea
            {...register("shortDescription")}
            placeholder="Write a brief summary of your blog post (max 300 characters)"
            rows={3}
            className="resize-none"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Content (Quill Editor) */}
        <div className="space-y-2">
          <Label>Blog Content</Label>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <QuillEditor
              className="bg-white dark:bg-slate-900"
              placeholder="Write your blog content..."
              theme="snow"
              value={watch("content")}
              onChange={(val) =>
                setValue("content", val, { shouldValidate: true })
              }
              style={{
                height: "250px",
                display: "flex",
                flexDirection: "column",
              }}
            />
          </div>

          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <Label> Images </Label>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`w-full sm:w-6/12
 flex items-center gap-3 border border-dashed rounded-lg p-3 cursor-pointer text-sm
              ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"} `}
          >
            <input {...getInputProps()} />
            <Upload size={18} className="text-muted-foreground" />
            <span className="text-foreground">
              Drag & drop or click to upload...
            </span>
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {images.length} image{images.length !== 1 ? "s" : ""} uploaded
              </p>
              <div className="grid grid-cols-4 gap-2 mt-4 relative">
                {/* Show only the first 4 images */}
                {images.slice(0, 4).map((img, index) => (
                  <div
                    key={index}
                    className="relative group shadow-lg rounded-xl overflow-hidden aspect-video"
                  >
                    <img
                      src={img.url}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-32 object-cover cursor-pointer hover:brightness-90 transition"
                      onClick={() => openGallery(index)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(index);
                      }}
                      className=" absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-red-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                      aria-label="Delete image"
                    >
                      <Trash2Icon size={20} />
                    </button>
                    {/* Image counter */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {/* +X More Tag (If there are more than 4 images) */}

                {images.length > 4 && (
                  <div
                    className="absolute right-2 bottom-2 bg-black/60 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => openGallery(4)}
                  >
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Type a tag..."
            />
            <Button type="button" onClick={addTag}>
              Add
            </Button>
          </div>
          <ul className="mt-3 flex gap-2 flex-wrap">
            {tags.map((item, i) => (
              <li
                key={i}
                className="px-3 py-1 bg-blue-100 dark:bg-slate-800 rounded flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center gap-5">
          <Link href="/dashboard/blogs">
            <Button variant="outline" disabled={isSubmitting}>
              Cansel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2  text-white font-bold font-sora"
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Publishing..."
              : isEdit
                ? "Update Blog"
                : "Publish Blog"}
          </Button>
        </div>
      </form>

      {images.length > 0 && (
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <ImageGalleryModal
            images={images}
            setImages={setImages}
            index={currentIndex}
            onClose={() => setGalleryOpen(false)}
            onDelete={handleDeleteImage}
            isEditMode
          />
        </Dialog>
      )}
    </>
  );
};
export default BlogForm;
