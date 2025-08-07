"use server";

import { getCurrentUser } from "@/lib/session";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { revalidatePath } from "next/cache";

export const updateUsername = async (newUsername) => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const existingUser = await UserModel.findOne({ username: newUsername });
    if (existingUser) throw new Error("This username is already taken");

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      { userName: newUsername },
      { new: true }
    );

    if (!updatedUser) throw new Error("User not found");
    revalidatePath("/account");

    return { success: true, updatedUser };
  } catch (error) {
    console.error("Failed to change username:", error);
    throw new Error(
      error.message || "Something went wrong while changing username"
    );
  }
};
