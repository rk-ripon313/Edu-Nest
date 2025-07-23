import { BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StudySeriesCard = ({ series }) => {
  const {
    _id,
    title,
    slug,
    description,
    thumbnail,
    educator,
    level,
    group,
    subject,
    price,
    chapters = [],
    outComes = [],
    tags = [],
  } = series;

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border shadow-sm hover:shadow-md transition overflow-hidden group w-full max-w-sm mx-auto h-full flex flex-col">
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video overflow-hidden">
        <Link href={`/study-series/${slug}`} className="block h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

          <Image
            src={thumbnail || "/default-series-thumbnail.jpg"}
            alt={title}
            width={400}
            height={225}
            className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
          />

          {/* Price badge */}
          {price > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold text-xs px-3 py-1 rounded-br-xl rounded-tl-xl shadow-md z-20">
              ৳{price}
            </div>
          )}

          {/* Free badge */}
          {price === 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-br-xl rounded-tl-xl shadow-md z-20">
              Free
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Badges */}
        <div className="flex flex-wrap gap-1 text-xs font-semibold mb-2">
          {level && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              {level}
            </span>
          )}
          {group && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              {group}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">
          <Link href={`/study-series/${slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h3>

        {/* Subject */}
        {subject && (
          <p className="text-sm text-muted-foreground mb-3">
            <BookOpen className="inline mr-1 w-4 h-4" />
            {subject}
          </p>
        )}

        {/* Educator */}
        {educator?.name && (
          <p className="text-sm text-muted-foreground mb-3">
            by {educator.name}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-auto mb-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{chapters.length} Chapters</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>12h 30m</span>
          </div>
        </div>

        {/* Outcomes (first 2) */}
        {outComes.length > 0 && (
          <div className="mt-2 space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground">
              You'll learn:
            </h4>
            <ul className="text-xs space-y-1">
              {outComes.slice(0, 2).map((outcome, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-1">✓</span>
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
              {outComes.length > 2 && (
                <li className="text-muted-foreground">
                  + {outComes.length - 2} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <Link
          href={`/study-series/${slug}`}
          className="mt-4 w-full px-4 py-2 text-sm text-center bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          View Series
        </Link>
      </div>
    </div>
  );
};

export default StudySeriesCard;
