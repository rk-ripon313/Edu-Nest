"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { updateBook } from "@/app/actions/boook.action";
import { updateStudySeries } from "@/app/actions/studySeries.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const descriptionSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
});

const DescriptionForm = ({ description = "", itemId, onModel }) => {
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
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description,
    },
  });

  const onSubmit = async (values) => {
    try {
      const updateAction =
        onModel === "StudySeries" ? updateStudySeries : updateBook;

      const result = await updateAction(itemId, {
        description: values?.description,
      });

      if (result?.success) {
        toggleEdit();
        toast.success(result?.message || "Description has been updated.");
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
      <div className="font-medium flex items-center justify-between">
        Description
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
      {!isEditing && <p className="text-sm mt-2">{description}</p>}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input
            {...register("description")}
            placeholder="Enter book description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
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
export default DescriptionForm;
