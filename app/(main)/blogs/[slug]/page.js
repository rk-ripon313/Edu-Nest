import {
  getBlogComments,
  getBlogDetailsBySlug,
} from "@/database/queries/blogs-data";
import { notFound } from "next/navigation";
import BlogCard from "../components/BlogCard";
import BlogComments from "../components/BlogComments";

const COMMENTS_PER_PAGE = 10;

const BlogDetailsPage = async ({
  params: { slug },
  searchParams: { sort },
}) => {
  const blog = await getBlogDetailsBySlug(slug);
  // console.log("BlogDetailsPage blog:", blog);
  if (!blog) notFound();

  const {
    comments,
    totalComments,
    hasMore,
    isCurrentUserBlogAuthor,
    currentUserImage,
  } = await getBlogComments({
    blogId: blog._id.toString(),
    page: 1,
    limit: COMMENTS_PER_PAGE,
    sort,
  });

  // console.log("BlogDetailsPage comments:", comments);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg my-6 max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl">
      {/* Blog Card */}
      <BlogCard blog={blog} isDetailsPage />

      {/* Comments Section */}
      <BlogComments
        blogId={blog._id.toString()}
        initialComments={comments}
        totalComments={totalComments}
        initialHasMore={hasMore}
        limit={COMMENTS_PER_PAGE}
        sort={sort}
        isCurrentUserBlogAuthor={isCurrentUserBlogAuthor}
        currentUserImage={currentUserImage}
      />
    </div>
  );
};
export default BlogDetailsPage;
