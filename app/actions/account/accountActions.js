"use server";

import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

//user name add or edit action
export const updateUserName = async (newUsername) => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const existingUser = await UserModel.findOne({ userName: newUsername });
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

// othrt fields edit action
export const updateUserField = async (updates) => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user?.email },
      { $set: updates },
      { new: true }
    );
    revalidatePath("/account");
    return { success: true, user: updatedUser };
  } catch (err) {
    console.error("Update failed:", err);
    return { success: false, error: err?.message || "Update failed" };
  }
};

//update password field
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const email = session.user.email;
    const user = await UserModel.findOne({ email });

    if (!user) return { success: false, error: "User not found" };

    // First time password set (Google user)
    if (!user.password) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      revalidatePath("/account");
      return { success: true, message: "Password set successfully" };
    }

    // Existing password change
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Incorrect old password" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    revalidatePath("/account");
    return { success: true, message: "Password changed successfully" };
  } catch (err) {
    return { success: false, error: err?.message || "Update failed" };
  }
};

//user following actions
export const toggleFollow = async ({ educatorUserName }) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return { success: false, message: "Unauthorized" };

    // fetch educator by username
    const educator = await UserModel.findOne({ userName: educatorUserName });
    if (!educator) return { success: false, message: "Educator not found" };

    const currentUserId = currentUser.id;
    const educatorId = educator._id.toString();

    if (currentUserId === educatorId)
      return { success: false, message: "You cannot follow yourself" };

    const userDocument = await UserModel.findById(currentUserId, "following");
    const currentlyFollowing = userDocument.following.includes(educatorId);

    let updateAction;
    let newMessage;
    const newFollowingStatus = !currentlyFollowing;

    if (currentlyFollowing) {
      // ---- Unfollow ----
      updateAction = "$pull";
      newMessage = "Unfollowed successfully.";
    } else {
      // ---- Follow ----
      updateAction = "$addToSet";
      newMessage = "Started following!";
    }

    await Promise.all([
      UserModel.findByIdAndUpdate(
        educatorId,
        { [updateAction]: { followers: currentUserId } },
        { new: true }
      ),
      UserModel.findByIdAndUpdate(
        currentUserId,
        { [updateAction]: { following: educatorId } },
        { new: true }
      ),
    ]);
    revalidatePath("/blogs");
    revalidatePath(`/educators/${educatorUserName}`);

    return { success: true, data: newFollowingStatus, message: newMessage };
  } catch (err) {
    return { success: false, message: err?.message || "Update failed" };
  }
};
