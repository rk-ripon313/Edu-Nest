import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import mongoose from "mongoose";

/**
 *  getBlogs() → Fetch blogs for All or Following tab
 * @param {Object} options
 * @param {String} options.currentTab - "all" | "following"
 * @param {String} options.search - search string
 * @param {String} options.currentSort - "trending" | "latest" | "popular" | "oldest"
 * @param {String} options.page - page number for pagination
 * @param {String} options.limit - items limit per page
 * @returns {Array} Blogs list with educator populated + likes/comments count
 */

export const getBlogs = async ({
  currentTab = "all",
  search = "",
  currentSort = "trending",
  page = 1,
  limit = 6,
}) => {
  try {
    const user = await getCurrentUser();

    // FOLLOWING tab but user not logged in OR no following list
    if (currentTab === "following" && (!user || !user.following?.length)) {
      return [];
    }

    // Base match
    let matchStage = { status: "published" };

    // Following tab → only blogs by followed educators
    if (currentTab === "following") {
      const followingIds = user.following.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      matchStage.educator = { $in: followingIds };
    }

    // Search filter
    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Trending date calculation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Pagination variables
    const skip = (Number(page) - 1) * Number(limit);

    const blogs = await BlogModel.aggregate([
      { $match: matchStage },

      // Count likes & comments
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          isTrending: { $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0] },
        },
      },

      //Sort before skip/limit
      {
        $sort: (() => {
          if (currentSort === "latest") return { createdAt: -1 };
          else if (currentSort === "oldest") return { createdAt: 1 };
          else if (currentSort === "popular")
            return { likesCount: -1, commentsCount: -1 };
          else return { isTrending: -1, likesCount: -1, commentsCount: -1 };
        })(),
      },

      //  PAGINATION STAGES
      { $skip: skip },
      { $limit: Number(limit) },

      // Populate educator fields
      {
        $lookup: {
          from: "users",
          localField: "educator",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                name: 1,
                userName: 1,
                image: 1,
              },
            },
          ],
          as: "educator",
        },
      },
      { $unwind: "$educator" },
    ]);

    return blogs;
  } catch (error) {
    console.error("getBlogs ERROR:", error);
    return [];
  }
};
