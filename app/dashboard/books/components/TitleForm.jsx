"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateABook } from "@/app/actions/boook.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/formetData";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const titleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
});

const TitleForm = ({ title = "", bookId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      title,
    },
  });

  const onSubmit = async (values) => {
    try {
      const slug = slugify(values?.title);
      const result = await updateABook(bookId, { title: values?.title, slug });

      if (result?.success) {
        toggleEdit();
        router.refresh();
        toast.success(result.message || "Book title has been updated.");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="mt-6  p-4">
      <div className="font-medium flex items-center justify-between">
        Book title
        <Button variant="ghost" onClick={toggleEdit} className="border">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{title}</p>}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input {...register("title")} placeholder="Enter book title" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
          <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save "}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
export default TitleForm;
