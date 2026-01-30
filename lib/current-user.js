import { auth } from "@/auth";
import { getUserWithFollowStatsByEmail } from "@/database/queries/users-data";
import { redirect } from "next/navigation";

/**
 * get current user with follow stats
 @returns {Promise<Object>} The current user object with follower and following data.
 */

export const getCurrentUserWithFollowStats = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUserWithFollowStatsByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return user;
};
