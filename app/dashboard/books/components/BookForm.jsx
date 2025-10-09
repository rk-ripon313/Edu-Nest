"use client";

import { bookSchema } from "@/lib/validators/book-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AddaNewBook, validateCategory } from "@/app/actions/boook.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression";
import { Eye, EyeOff, FileText, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BookForm = ({ categories }) => {
  const router = useRouter();
  const [outcomes, setOutcomes] = useState([]);
  const [tags, setTags] = useState([]);
  const [outcomeInput, setOutcomeInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: { label: "", group: "", subject: "", part: "" },
    },
  });

  // Outcomes
  const addOutcome = () => {
    if (!outcomeInput.trim()) return;
    if (outcomeInput.length < 5) {
      toast.error("Outcome must be at least 5 characters");
      return;
    }
    if (outcomeInput.length > 100) {
      toast.error("Outcome cannot exceed 100 characters");
      return;
    }
    if (outcomes.length >= 10) {
      toast.error("Maximum 10 outcomes allowed");
      return;
    }
    setOutcomes([...outcomes, outcomeInput.trim()]);
    setOutcomeInput("");
  };

  const removeOutcome = (i) => {
    setOutcomes(outcomes.filter((_, idx) => idx !== i));
  };

  // Tags
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tagInput.length < 2) {
      toast.error("Tag must be at least 2 characters");
      return;
    }
    if (tagInput.length > 20) {
      toast.error("Tag cannot exceed 20 characters");
      return;
    }
    if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (i) => {
    setTags(tags.filter((_, idx) => idx !== i));
  };

  // Dropzones
  const { getRootProps: getThumbProps, getInputProps: getThumbInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,

      onDrop: async (acceptedFiles) => {
        if (!acceptedFiles[0]) return;

        try {
          const options = {
            maxSizeMB: 1, // 1MB
            maxWidthOrHeight: 1200, // resize
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(
            acceptedFiles[0],
            options
          );
          setThumbnail(compressedFile);
        } catch (error) {
          console.error("Image compression error:", error);
        }
      },
    });

  const { getRootProps: getFileProps, getInputProps: getFileInputProps } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        const MAX_SIZE = 10 * 1024 * 1024;
        if (!selectedFile) return;

        // validation
        if (selectedFile.size > MAX_SIZE) {
          toast.error("PDF must be under 10MB");
          return;
        }

        setFile(selectedFile);
      },
    });

  // Submit--saveing a new book in db

  const onSubmit = async (data) => {
    try {
      //validate form schema
      const result = bookSchema.safeParse({
        ...data,
        outcomes,
        tags,
        thumbnail,
        file,
        isPublished,
      });
      if (!result.success) {
        // console.error(result.error.format());
        toast.error(
          result?.error?.issues?.[0]?.message || "Validation failed!"
        );
        return;
      }

      // validate category (server)
      const isValidcategory = await validateCategory(data?.category);
      if (!isValidcategory.success) {
        toast.error("Category does not exist!");
        return;
      }

      //uplood file and thumbnail to cloudinary

      const [thumbnailUrl, fileUrl] = await Promise.all([
        uploadFileToCloudinary(thumbnail, "image", "thumbnail"),
        uploadFileToCloudinary(file, "pdf", "Books"),
      ]);

      if (!thumbnailUrl) {
        toast.error("Image upload failed");
        return;
      }

      if (!fileUrl) {
        toast.error("fileUrl upload failed");
        return;
      }

      // save in DB (server action)
      const res = await AddaNewBook({
        ...data,
        outcomes,
        tags,
        thumbnailUrl,
        fileUrl,
        categoryId: isValidcategory?.categoryId,
        isPublished,
      });

      if (!res.success) {
        toast.error(res?.message || "Book not saved");
        return;
      }

      toast.success(" Book added successfully!");

      reset();
      setOutcomes([]);
      setTags([]);
      setThumbnail(null);
      setFile(null);
      setIsPublished(false);
      router.push("/dashboard/books");
    } catch (error) {
      toast.error(error?.message || "Book Added Failed! ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 shadow-lg rounded-lg bg-white dark:bg-slate-950 space-y-6"
    >
      {/* Top Row: Status Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Label className="text-xl font-bold">Enter Your Book Information</Label>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-gray-50 dark:bg-slate-700">
          {isPublished ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-red-500" />
          )}
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`h-6 w-12 flex items-center rounded-full p-1 transition-colors ${
              isPublished ? "bg-green-500" : "bg-gray-300 dark:bg-slate-800"
            }`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-white dark:bg-black shadow-md transform transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Basic Informatio - title,desc,price,thumb */}
      <div>
        <Label className="text-lg font-semibold">Basic Information</Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
          {/* Title + Description + Price */}
          <div className="space-y-4">
            <div>
              <Label>Book Title</Label>
              <Input {...register("title")} placeholder="Enter book title" />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                className="resize-none"
                placeholder="Write a short description"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="max-w-[200px]">
              <Label>Price (৳)</Label>
              <Input {...register("price", { valueAsNumber: true })} />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <div
              {...getThumbProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 mt-2 h-[230px] flex items-center justify-center ${
                thumbnail
                  ? "border-green-500 bg-green-50 dark:bg-blue-950"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
              }`}
            >
              <input {...getThumbInputProps()} />
              {thumbnail ? (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 text-green-600" />
                  <p className="text-green-600 font-medium truncate max-w-[200px]">
                    {thumbnail.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-700">Drag & drop or click</p>
                </div>
              )}
            </div>
            {errors?.thumbnail && (
              <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <Label className="text-lg font-semibold">Category Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Label>Label</Label>

            <select
              {...register("category.label")}
              className="w-full border rounded-lg px-2 py-1 text-sm"
            >
              <option value="">Select Label</option>
              {[...(categories?.labelSet || [])].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category?.label && (
              <p className="text-red-500 text-sm">
                {errors.category.label.message}
              </p>
            )}
          </div>
          <div>
            <Label>Group</Label>
            <select
              {...register("category.group")}
              className="w-full border rounded-lg px-2 py-1 text-sm"
            >
              <option value="">Select Group</option>

              {[...(categories?.groupSet || [])].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category?.group && (
              <p className="text-red-500 text-sm">
                {errors.category.group.message}
              </p>
            )}
          </div>
          <div>
            <Label>Subject</Label>
            <select
              {...register("category.subject")}
              className="w-full border rounded-lg px-2 py-1 text-sm"
            >
              <option value="">Select Subject</option>
              {[...(categories?.subSet || [])].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category?.subject && (
              <p className="text-red-500 text-sm">
                {errors.category.subject.message}
              </p>
            )}
          </div>
          <div>
            <Label>Part </Label>
            <select
              {...register("category.part")}
              className="w-full border rounded-lg px-2 py-1 text-sm"
            >
              <option value="">Select part</option>
              {[...(categories?.partSet || [])].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* File */}
      <div>
        <Label>Book File (PDF)</Label>
        <div
          {...getFileProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 mt-2 min-h-[150px] flex items-center justify-center ${
            file
              ? "border-green-500 bg-green-50 dark:bg-blue-950"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
          }`}
        >
          <input {...getFileInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-green-600" />
              <p className="text-green-600 font-medium truncate max-w-[200px]">
                {file.name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-10 h-10 text-gray-400" />
              <p className="text-gray-700">Drag & drop or click</p>
            </div>
          )}
        </div>
      </div>

      {/* Outcomes */}
      <div>
        <Label>Learning Outcomes</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={outcomeInput}
            onChange={(e) => setOutcomeInput(e.target.value)}
            placeholder="Type an outcome..."
          />
          <Button type="button" onClick={addOutcome}>
            Add
          </Button>
        </div>
        <ul className="mt-3 space-y-1">
          {outcomes.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeOutcome(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
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

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
      >
        {isSubmitting ? "Saving..." : "Save Book"}
      </Button>
    </form>
  );
};

export default BookForm;
