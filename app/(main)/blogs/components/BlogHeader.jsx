import FollowBtn from "@/components/details/FollowBtn";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogHeader = ({ educator, createdAt, isOwnBlog }) => {
  const educatorName = educator.firstName
    ? `${educator?.firstName} ${educator?.lastName}`
    : educator?.name;
  const educatorImage = educator?.image || "/default-avatar.jpg";

  return (
    <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
      <div className="flex items-center">
        <Link href={`/educators/${educator?.userName}`}>
          <div className="w-10 h-10 relative mr-3">
            <Image
              src={educatorImage}
              alt={educatorName}
              fill
              className="rounded-full object-cover border-2 border-indigo-500"
            />
          </div>
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/educators/${educator?.userName}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {educatorName}
            </Link>

            {/* follow button */}
            {!isOwnBlog && (
              <FollowBtn
                isFollowing={educator?.isFollowing}
                educatorUserName={educator?.userName}
              />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {createdAt
              ? format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")
              : "Date Unavailable"}
          </p>
        </div>
      </div>
      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};
export default BlogHeader;
