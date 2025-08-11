import Image from "next/image";
import Link from "next/link";

const EnrolledItemCard = ({ item, type = "book" }) => {
  const { id, title, thumbnail, educator, category, price } = item;

  const isSeries = type.toLowerCase() === "series";
  const name =
    educator?.firstName && educator?.lastName
      ? educator.firstName + " " + educator.lastName
      : educator?.name;

  const href = isSeries ? `/study-series/${id}/play` : `/books/${id}/read`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md w-full">
      {/* Thumbnail + Label */}
      <div className="relative flex-shrink-0 w-full sm:w-28 h-36 sm:h-20 rounded overflow-hidden">
        <Link href={href} className="block w-full h-full">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            priority={false}
          />
          <span className="absolute top-1 left-1 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded shadow">
            {isSeries ? "Series" : "Book"}
          </span>
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow min-w-0">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1 text-xs font-semibold text-muted-foreground my-1">
          {category?.label && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-2 py-0.5">
              {category.label}
            </span>
          )}
          {category?.group && (
            <span className="bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full px-2 py-0.5">
              {category.group}
            </span>
          )}
          {category?.subject && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full px-2 py-0.5">
              {category.subject}
            </span>
          )}
          {category?.part && (
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
              Part {category.part}
            </span>
          )}
        </div>

        {/* Educator */}
        {educator && (
          <p className="text-sm text-muted-foreground">
            by{" "}
            <Link
              href={`/educator/${educator?.userName}`}
              className="underline font-sora font-medium"
            >
              {name}
            </Link>
          </p>
        )}

        {/* Price for item */}
        {price && (
          <p className="text-sm font-semibold mt-1">
            Price: {price === 0 ? "Free" : `${price}৳`}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <Link
        href={href}
        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition mt-2 sm:mt-0 sm:ml-auto"
      >
        {isSeries ? "Watch Series" : "Read Book"}
      </Link>
    </div>
  );
};

export default EnrolledItemCard;
