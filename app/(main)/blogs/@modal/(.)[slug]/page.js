import {
  getBlogComments,
  getBlogDetailsBySlug,
} from "@/database/queries/blogs-data";
import BlogCard from "../../components/BlogCard";
import BlogComments from "../../components/BlogComments";
import BlogModal from "../../components/BlogModal";

const COMMENTS_PER_PAGE = 10;

const InterceptingBlogDetailsPage = async ({
  params: { slug },
  searchParams: { sort },
}) => {
  const blog = await getBlogDetailsBySlug(slug);

  if (!blog) return null;

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

  return (
    <BlogModal blogTitle={blog?.title}>
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
    </BlogModal>
  );
};
export default InterceptingBlogDetailsPage;
