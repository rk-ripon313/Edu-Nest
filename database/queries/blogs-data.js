import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import mongoose from "mongoose";

/**
 *  getBlogs() → Fetch blogs for All or Following tab
 * @param {Object} options
 * @param {String} options.currentTab - "all" | "following"
 * @param {String} options.search - search string
 * @param {String} options.currentSort - "trending" | "latest" | "popular" | "oldest"
 * @param {String} options.page - page number for pagination
 * @param {String} options.limit - items limit per page
 * @returns {Array} Blogs list with educator populated + likes/comments count + follow status + likers details
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

    const currentUserId = user?.id;
    const followingIds = user?.following?.map((id) => id.toString()) || [];

    // FOLLOWING tab but user not logged in OR no following list
    if (currentTab === "following" && (!user || !followingIds.length)) {
      return [];
    }

    //  Base match and filters
    let matchStage = { status: "published" };

    // Following tab → only blogs by followed educators
    if (currentTab === "following") {
      matchStage.educator = {
        $in: followingIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
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

    //  AGGREGATION PIPELINE
    const blogs = await BlogModel.aggregate([
      { $match: matchStage },

      // Calculate Counts & Ownership
      {
        $addFields: {
          // Count likes & comments
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          // Like status for current user
          isLiked: {
            $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"],
          },
          // Trending
          isTrending: { $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0] },
          // Ownership status
          isOwnBlog: {
            $eq: ["$educator", new mongoose.Types.ObjectId(currentUserId)],
          },
        },
      },

      // Sort before skip/limit (Must be after counts are calculated)
      {
        $sort: (() => {
          if (currentSort === "latest") return { createdAt: -1 };
          else if (currentSort === "oldest") return { createdAt: 1 };
          else if (currentSort === "popular")
            return { likesCount: -1, commentsCount: -1 };
          else return { isTrending: -1, likesCount: -1, commentsCount: -1 };
        })(),
      },

      //  Pagination Stages
      { $skip: skip },
      { $limit: Number(limit) },

      // Populate Educator details
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

      //  Add isFollowing field to educator
      {
        $addFields: {
          "educator.isFollowing": {
            $cond: {
              // Check if the educator's ID is present in the current user's following list
              if: {
                $in: [
                  "$educator._id",
                  followingIds.map((id) => new mongoose.Types.ObjectId(id)),
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },

      //  Populate users who liked the blog
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likersDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                userName: 1,
                image: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
    ]);

    return blogs;
  } catch (error) {
    console.error("getBlogs ERROR:", error);
    return [];
  }
};
