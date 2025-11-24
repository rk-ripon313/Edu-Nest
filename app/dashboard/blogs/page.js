import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

const BlogListPage = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  // const blogs = await getEducatorBlogs(user.id);

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
    </div>
  );
};
export default BlogListPage;
