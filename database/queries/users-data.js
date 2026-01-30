import { replaceMongoIdInObject } from "@/lib/transformId";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

/**
 * Fetches a user with their follower and following statistics by email.
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object>} The user object with follower and following data.
 */

export const getUserWithFollowStatsByEmail = async (email) => {
  if (!email) return null;

  await dbConnect();

  const user = await UserModel.findOne({ email })
    .select("email firstName lastName name image userName role")
    .populate("followers", "firstName lastName image userName role")
    .populate("following", "firstName lastName image userName role")
    .lean();

  if (!user) {
    return null;
  }

  return replaceMongoIdInObject(user);
};
