import { getBlogDetailsBySlug } from "@/database/queries/blogs-data";
import { notFound } from "next/navigation";
import BlogCard from "../components/BlogCard";

const BlogDetailsPage = async ({ params: { slug } }) => {
  const blog = await getBlogDetailsBySlug(slug);
  // console.log("BlogDetailsPage blog:", blog);
  if (!blog) notFound();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg my-6 max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl">
      {/* Blog Card */}
      <BlogCard blog={blog} isDetailsPage />

      {/* Comments Section */}
    </div>
  );
};
export default BlogDetailsPage;
