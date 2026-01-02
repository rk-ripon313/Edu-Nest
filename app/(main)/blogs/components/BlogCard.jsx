import BlogCardActions from "./BlogCardActions";
import BlogCardStats from "./BlogCardStats";
import BlogContent from "./BlogContent";
import BlogHeader from "./BlogHeader";
import BlogImages from "./BlogImages";

const BlogCard = ({ blog, isDashboard = false }) => {
  const {
    _id,
    title,
    slug,
    shortDescription,
    content = [],
    images = [],
    educator,
    createdAt,
    isLiked,
    likesCount,
    commentsCount,
    likersDetails,
    isOwnBlog,
    status,
  } = blog;

  return (
    <>
      {/* Header: Educator Info & Time */}
      <BlogHeader
        educator={educator}
        createdAt={createdAt}
        isOwnBlog={isOwnBlog}
        status={status}
        isDashboard={isDashboard}
        blogId={_id?.toString()}
      />

      {/* Blog Content: Title & Short Description + Main Content */}
      <BlogContent
        title={title}
        shortDescription={shortDescription}
        content={content}
      />

      {/* Image Gallery (2-Image Logic) */}
      {images && images.length > 0 && <BlogImages images={images} />}

      {/* Footer Stats: Likes, Comments, Views */}
      <BlogCardStats
        likesCount={likesCount}
        commentsCount={commentsCount}
        likersDetails={likersDetails}
      />

      {/* Interaction Bar: Like, Comment, Share */}
      <BlogCardActions
        blogId={_id.toString()}
        isLiked={isLiked}
        slug={slug}
        blogTitle={title}
      />
    </>
  );
};

export default BlogCard;
