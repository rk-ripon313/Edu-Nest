import { z } from "zod";

export const EducatorSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  expertise: z.string().min(2, "Expertise is required"),
  qualification: z.string().min(2, "Qualification is required"),
  facebook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
