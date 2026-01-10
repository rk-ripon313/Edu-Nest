import FollowBtn from "@/components/details/FollowBtn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogActionsDropdown from "./BlogActionsDropdown";

const BlogHeader = ({
  educator,
  createdAt,
  isOwnBlog,
  status,
  isDashboard = false,
  blogId,
}) => {
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

            {/* STATUS BADGE */}
            {isOwnBlog && isDashboard && (
              <Badge
                variant={status === "private" ? "outline" : "default"}
                className={`capitalize ${status === "private" && "flex items-center gap-1 border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"}`}
              >
                {status === "private" && <Lock className="w-3 h-3" />}
                {status}
              </Badge>
            )}

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

      <BlogActionsDropdown isOwnBlog={isOwnBlog} blogId={blogId} />
    </div>
  );
};
export default BlogHeader;
