import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import { BlogCommentModel } from "@/models/blogComment-model";
import { dbConnect } from "@/service/mongo";
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
    await dbConnect();
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
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          isTrending: { $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0] },
          isLiked: currentUserId
            ? { $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"] }
            : false,
          isOwnBlog: currentUserId
            ? { $eq: ["$educator", new mongoose.Types.ObjectId(currentUserId)] }
            : false,
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

/**
 * getBlogDetailsBySlug() → Fetch single blog details by slug
 * @param {String} slug - blog slug
 * @returns {Object} Blog details with educator populated + likes/comments count + follow status + likers details
 */
export const getBlogDetailsBySlug = async (slug) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    const currentUserId = user?.id;
    const followingIds = user?.following || [];

    const blog = await BlogModel.aggregate([
      { $match: { slug, status: "published" } },

      // Likes/comments count & isLiked
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          isLiked: currentUserId
            ? { $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"] }
            : false,
          isOwnBlog: currentUserId
            ? { $eq: ["$educator", new mongoose.Types.ObjectId(currentUserId)] }
            : false,
        },
      },

      // Educator populate
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

      // Populate likes users
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          pipeline: [{ $project: { _id: 1, name: 1, userName: 1, image: 1 } }],
          as: "likersDetails",
        },
      },
    ]);

    return blog[0] || null;
  } catch (error) {
    console.error("getBlogDetailsBySlug ERROR:", error);
    return null;
  }
};

/**
 * getBlogComments() → Fetch comments for a blog
 * @param {String} blogId - Blog ID
 * @returns {Object} -comments list with user populated  + likes count + isLiked + isAuthor + replies processed
 */

export const getBlogComments = async ({
  blogId,
  page = 1,
  limit = 10,
  sort = "latest",
}) => {
  try {
    await dbConnect();

    const [user, blogDoc, totalComments] = await Promise.all([
      getCurrentUser(),
      BlogModel.findById(blogId)
        .select("educator")
        .populate("educator", "_id")
        .lean(),
      BlogCommentModel.countDocuments({
        blog: new mongoose.Types.ObjectId(blogId),
        parentComment: null,
      }),
    ]);

    const currentUserId = user?.id
      ? new mongoose.Types.ObjectId(user.id)
      : null;

    const blogAuthorId = blogDoc?.educator?._id
      ? new mongoose.Types.ObjectId(blogDoc.educator._id)
      : null;

    const isCurrentUserBlogAuthor =
      currentUserId && blogAuthorId
        ? currentUserId.equals(blogAuthorId)
        : false;

    const skip = (page - 1) * limit;

    // Sorting logic
    const sortStage = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const comments = await BlogCommentModel.find({
      blog: new mongoose.Types.ObjectId(blogId),
      parentComment: null,
    })
      .sort(sortStage)
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "firstName lastName name userName image")
      .populate("replies.user", "firstName lastName name userName image")
      .lean();

    // Process each comment for likesCount, isLiked, isAuthor, replies etc.
    comments.forEach((comment) => {
      const commentUserId = comment.user?._id.toString(); //comment author ID

      comment.likesCount = comment.likes ? comment.likes.length : 0; //likes count

      // isLiked, isAuthor, isOwner flags
      comment.isLiked =
        currentUserId && comment.likes
          ? comment.likes.some((likeId) => likeId.equals(currentUserId))
          : false;
      comment.isAuthor =
        blogAuthorId && commentUserId
          ? blogAuthorId.equals(commentUserId)
          : false;
      comment.isOwner =
        currentUserId && commentUserId
          ? currentUserId.equals(commentUserId)
          : false;

      comment.repliesCount = comment.replies ? comment.replies.length : 0; //replies count

      // Replies Processing (Always Oldest First & isAuthor)
      if (comment.replies && comment.replies.length > 0) {
        //Sortby createdAt ascending
        comment.replies.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        comment.replies = comment.replies.map((reply) => {
          const replyUserId = reply.user?._id.toString();

          return {
            ...reply,
            isAuthor:
              blogAuthorId && replyUserId
                ? blogAuthorId.equals(replyUserId)
                : false,
            isOwner:
              currentUserId && replyUserId
                ? currentUserId.equals(replyUserId)
                : false,
          };
        });
      }
    });

    return {
      comments,
      totalComments,
      hasMore: totalComments > page * limit,
      isCurrentUserBlogAuthor,
      currentUserImage: user?.image || null,
    };
  } catch (error) {
    console.error("getBlogComments ERROR:", error);
    return {
      comments: [],
      totalComments: 0,
      hasMore: false,
      isCurrentUserBlogAuthor: false,
      currentUserImage: null,
    };
  }
};
