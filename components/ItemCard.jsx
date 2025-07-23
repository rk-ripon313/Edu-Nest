import { Badge } from "@/components/ui/badge";
import { ListOrdered, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({ item, type }) => {
  const {
    id,
    title,
    thumbnail,
    price,
    category,
    educator,
    chapters = [],
    totalEnrollments = 0,
    averageRating = 0,
    totalRatings = 0,
  } = item;

  const isSeries = type === "series";

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border shadow-md hover:shadow-lg transition overflow-hidden group w-full max-w-sm mx-auto h-full flex flex-col">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Link
          href={isSeries ? `/study-series/${id}` : `/books/${id}`}
          className="block h-full"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

          <Image
            src={thumbnail}
            alt={title}
            width={320}
            height={240}
            className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
            priority={false}
          />

          {/* Book/Series Label */}
          <Badge className="absolute top-2 left-2 z-20 bg-accent text-white rounded-lg text-sm font-semibold">
            {isSeries ? "Series" : "Book"}
          </Badge>

          {/* Chapter  */}
          {isSeries && (
            <div className="absolute bottom-2 left-2 text-white text-xs flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded z-20">
              <ListOrdered className="w-3 h-3" />
              {chapters.length} Chapters
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-0 right-0 z-20">
            <div className="relative">
              <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md">
                {price === 0 ? "Free" : `${price}৳`}
              </div>
              <div className="absolute -bottom-1 right-0 w-0 h-0 border-t-[8px] border-t-yellow-400 border-l-[8px] border-l-transparent"></div>
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1 text-xs font-semibold mb-2">
          {category?.label && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
              {category.label}
            </span>
          )}
          {category?.group && (
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">
              {category.group}
            </span>
          )}
          {category?.part && (
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full">
              Part {category.part}
            </span>
          )}
        </div>

        {/* Subject */}
        {category?.subject && (
          <div className="mb-2">
            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              {category.subject}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold line-clamp-2">
          {title.length > 22 ? `${title.slice(0, 22)}...` : title}
        </h3>

        {/* Educator */}
        <span className="text-sm text-muted-foreground mb-3">
          by {educator?.firstName} {educator?.lastName}
        </span>

        {/* Rating & Enrollment */}
        <div className="flex justify-between items-center mt-auto mb-3">
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span>{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({totalRatings})
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{totalEnrollments} enrolled</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={isSeries ? `/study-series/${id}` : `/books/${id}`}
          className="mt-auto w-full px-4 py-2 text-sm text-center bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
