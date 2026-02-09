import { formatDate } from "@/lib/formetData";
import { Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogCardMini = ({ blog }) => {
  const {
    slug,
    title,
    shortDescription,
    images = [],
    educator,
    createdAt,
    likesCount,
    commentsCount,
  } = blog;

  const educatorName = educator?.firstName
    ? `${educator.firstName} ${educator.lastName}`
    : educator?.name;

  return (
    <div className="w-64 h-[350px] flex flex-col bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b dark:border-slate-700">
        <Link
          href={`/educators/${educator?.userName}`}
          className="w-8 h-8 relative"
        >
          <Image
            src={educator?.image || "/default-avatar.jpg"}
            alt={educatorName}
            fill
            className="rounded-full object-cover"
          />
        </Link>
        <div className="text-sm">
          <p className="font-semibold line-clamp-1">{educatorName}</p>
          <p className="text-muted-foreground text-xs">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {/* Image */}
      <Link href={`/blogs/${slug}`} className="relative h-36 bg-muted">
        {images[0] ? (
          <Image src={images[0]} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {shortDescription}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Heart size={14} className="text-red-500" />
          {likesCount}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={14} />
          {commentsCount}
        </span>
      </div>
    </div>
  );
};

export default BlogCardMini;
