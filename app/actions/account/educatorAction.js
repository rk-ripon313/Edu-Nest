"use server";

import { getCurrentUser } from "@/lib/session";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { revalidatePath } from "next/cache";

export const updateEducatorInfo = async (formData) => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        role: "educator",
        educatorProfile: {
          bio: formData.bio,
          qualification: formData.qualification,
          expertise: formData.expertise.split(",").map((e) => e.trim()),
          socialLinks: {
            facebook: formData.facebook || "",
            linkedin: formData.linkedin || "",
            website: formData.website || "",
          },
          isVerified: false,
        },
      },
      { new: true }
    );

    if (!updatedUser) throw new Error("User not found");

    revalidatePath("/account/educator-profile");

    return { success: true };
  } catch (error) {
    console.error("Educator info update failed:", error);
    throw new Error(error.message || "Failed to update educator profile");
  }
};
