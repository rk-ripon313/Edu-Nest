import Image from "next/image";
import Link from "next/link";

import { ArrowRight, BookOpen, GraduationCap, Layers3 } from "lucide-react";

const EnrolledItemCard = ({ item, type }) => {
  const isSeries = type === "series";
  const Icon = isSeries ? GraduationCap : BookOpen;

  const href = isSeries
    ? `/study-series/${item.id}/play`
    : `/books/${item.id}/read`;

  const educatorName = item.educator
    ? `${item.educator.firstName || ""} ${item.educator.lastName || ""}`.trim()
    : "";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-gray-200/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/40 dark:hover:shadow-black/20">
      <Link
        href={href}
        className="relative block aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-900"
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon
              size={36}
              strokeWidth={1.5}
              className="text-gray-400 dark:text-slate-500"
            />
          </div>
        )}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Icon size={13} />
          {isSeries ? "Study Series" : "Book"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.category?.label && (
          <p className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">
            {item.category.label}
          </p>
        )}

        <Link href={href}>
          <h3 className="mt-1.5 line-clamp-2 font-sora text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
            {item.title}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-slate-400">
          {educatorName && <span className="truncate">By {educatorName}</span>}

          {isSeries && (
            <span className="inline-flex items-center gap-1.5">
              <Layers3 size={14} />
              {item.chapters?.length || 0} Chapters
            </span>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="h-px bg-gray-100 dark:bg-slate-700" />

          <Link
            href={href}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white"
          >
            {isSeries ? "Continue Learning" : "Continue Reading"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EnrolledItemCard;
