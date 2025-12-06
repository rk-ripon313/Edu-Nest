"use server";

import { getBlogComments } from "@/database/queries/blogs-data";

/**
 * fetchCommentsByServerAction() → its call  getBlogComments() function
 * @param {Object} payload - blogId, page, limit, sort
 * @returns {Object} - comments list with user populated + likes count + isLiked + isAuthor + replies processed
 */

export const fetchCommentsByServerAction = async (payload) => {
  // Call the server-side function
  const newComments = await getBlogComments(payload);
  return newComments;
};
