import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import BlogForm from "../../components/BlogForm";

const BlogEditPage = async ({ params: { blogId } }) => {
  const [blog, user] = await Promise.all([
    BlogModel.findById(blogId),
    getCurrentUser(),
  ]);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Blog Not Found!
          </h1>
          <p className="text-gray-500">
            {`The blog you're looking for doesn't exist.`}
          </p>
        </div>
      </div>
    );
  }
  if (!user || user?.id !== blog.educator.toString())
    return <p>Access Denied</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
      <BlogForm blogId={blog._id.toString()} initialData={blog} />
    </div>
  );
};
export default BlogEditPage;
