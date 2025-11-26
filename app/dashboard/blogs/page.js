import { deleteBlog } from "@/app/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import mongoose from "mongoose";
import Link from "next/link";

const BlogListPage = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const blogs = await BlogModel.find({
    educator: new mongoose.Types.ObjectId(user.id),
  }).sort({ createdAt: -1 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Blogs</h1>

        <Link
          href="/dashboard/blogs/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add New Blog
        </Link>
      </div>

      {/* Blog List --BASIC_DEMO_TEMPORARY-DESIGN */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600 text-sm">{blog.shortDescription}</p>
            <div>{blog.content} </div>
            <div className="text-xs text-gray-500 mt-2 flex gap-4">
              <span>Views: {blog.views}</span>
              <span>Status: {blog.status}</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="mt-3 flex gap-3">
              <Link
                href={`/dashboard/blogs/${blog._id.toString()}/edit`}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Edit
              </Link>
              <form action={deleteBlog.bind(null, blog._id.toString())}>
                <Button
                  type="submit"
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}

        {/* If empty */}
        {blogs.length === 0 && <p>No blogs found.</p>}
      </div>
    </div>
  );
};

export default BlogListPage;
