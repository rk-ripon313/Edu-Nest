"use server";

import { auth } from "@/auth";
import { UserModel } from "@/models/user-model";

export const updateEducatorProfile = async (data) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const { bio, expertise, qualification, socialLinks } = data;

  try {
    await UserModel.updateOne(
      { email: session.user.email },
      {
        $set: {
          "educatorProfile.bio": bio,
          "educatorProfile.expertise":
            typeof expertise === "string"
              ? expertise.split(",").map((e) => e.trim())
              : expertise,
          "educatorProfile.qualification": qualification,
          "educatorProfile.socialLinks": socialLinks,
          role: "educator",
        },
      }
    );

    return { success: true };
  } catch (err) {
    console.error("Educator update failed", err);
    return { error: "Something went wrong" };
  }
};
