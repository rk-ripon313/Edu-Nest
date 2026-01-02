import BlogCard from "@/app/(main)/blogs/components/BlogCard";
import BlogFilters from "@/app/(main)/blogs/components/BlogFilters";
import Empty from "@/components/Empty";
import { getDashboardBlogs } from "@/database/queries/dashboard-data";
import Link from "next/link";

const BlogListPage = async ({
  searchParams: { search = "", sort = "latest" },
}) => {
  const blogs = await getDashboardBlogs({ search, sort });

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

      {/*Educator Blog List */}
      <div className="space-y-6  mx-3 md:mx-4 lg:mx-6 ">
        <BlogFilters sort={sort} />
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <BlogCard blog={blog} isDashboard />
            </div>
          ))
        ) : (
          <Empty title={" No blogs found for this educator."} />
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
