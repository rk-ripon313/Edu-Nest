import { z } from "zod";
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];
export const studySeriesSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),

  category: z.object({
    label: z.string().min(1, "Category label is required"),
    group: z.string().min(1, "Category group is required"),
    subject: z.string().min(1, "Subject is required"),
    part: z.string().optional(),
  }),

  outcomes: z
    .array(
      z
        .string()
        .min(5, "Outcome must be at least 5 characters")
        .max(100, "Outcome cannot exceed 100 characters")
    )
    .max(10, "You cannot add more than 10 outcomes")
    .optional(),

  tags: z
    .array(
      z
        .string()
        .min(2, "Tag must be at least 2 characters")
        .max(20, "Tag cannot exceed 20 characters")
    )
    .max(5, "You cannot add more than 5 tags")
    .optional(),

  thumbnail: z
    .any()
    .refine((file) => file !== null, "Thumbnail is required")
    .refine(
      (file) => !file || (file.size && file.size <= MAX_IMAGE_SIZE),
      "Thumbnail must be under 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp formats are supported"
    ),

  isPublished: z.boolean().default(false).optional(),
});
