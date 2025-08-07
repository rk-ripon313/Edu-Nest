import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(15, "Username must be at most 15 characters")
  .regex(
    /^(?!.*[.-]{2})[a-zA-Z][a-zA-Z0-9.-]*[a-zA-Z0-9]$/,
    "Username must start with a letter, end with a letter or number, and can only contain letters, numbers, dots, or dashes without consecutive dots or dashes."
  );
