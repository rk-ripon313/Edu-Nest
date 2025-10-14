"use client";

import { updateBook, validateCategory } from "@/app/actions/boook.action";
import { updateStudySeries } from "@/app/actions/studySeries.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

//  Zod schema
const categorySchema = z.object({
  label: z.string().min(1, "Category label is required"),
  group: z.string().min(1, "Category group is required"),
  subject: z.string().min(1, "Subject is required"),
  part: z.string().optional(),
});

const CategoryForm = ({ category, categories, itemId, onModel }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      label: category?.label || "",
      group: category?.group || "",
      subject: category?.subject || "",
      part: category?.part || "",
    },
  });

  //  Handle form submit
  const onSubmit = async (values) => {
    try {
      const category = await validateCategory(values);

      if (!category?.categoryId) {
        toast.error("Category does not exist!");
        return;
      }

      const updateAction =
        onModel === "StudySeries" ? updateStudySeries : updateBook;

      const result = await updateAction(itemId, {
        category: category.categoryId,
      });

      if (result?.success) {
        toggleEdit();
        toast.success(result?.message || "Category has been updated.");
        router.refresh();
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="mt-2 p-3 bg-blue-50 dark:bg-slate-900 rounded-md text-sm text-blue-700">
            {category?.label ? (
              <>
                {category.label}
                {category.group && ` → ${category.group}`}
                {category.subject && ` → ${category.subject}`}
                {category.part && ` → ${category.part}`}
              </>
            ) : (
              <span className="text-gray-500">No category set</span>
            )}
          </div>
        </div>

        <Button variant="ghost" onClick={toggleEdit} className="border">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Label */}
            <div>
              <Label>Label</Label>
              <select
                {...register("label")}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="">Select Label</option>
                {[...(categories?.labelSet || [])].map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.label && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.label.message}
                </p>
              )}
            </div>

            {/* Group */}
            <div>
              <Label>Group</Label>
              <select
                {...register("group")}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="">Select Group</option>
                {[...(categories?.groupSet || [])].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {errors.group && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.group.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <Label>Subject</Label>
              <select
                {...register("subject")}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="">Select Subject</option>
                {[...(categories?.subSet || [])].map((subSet) => (
                  <option key={subSet} value={subSet}>
                    {subSet}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Part  */}
            <div>
              <Label>Part </Label>
              <select
                {...register("part")}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="">Select Part</option>
                {[...(categories?.partSet || [])].map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
export default CategoryForm;
