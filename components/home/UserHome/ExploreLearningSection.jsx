import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";

const resources = [
  {
    title: "Discover Books",
    description:
      "Explore educational books, discover new subjects, and expand your knowledge.",
    href: "/books",
    action: "Browse Books",
    icon: BookOpen,
  },
  {
    title: "Explore Study Series",
    description:
      "Learn through structured lessons and educational video series.",
    href: "/study-series",
    action: "Browse Series",
    icon: GraduationCap,
  },
];

const ExploreLearningSection = () => {
  return (
    <SectionWrapper className="pt-0">
      <SectionHeader
        title="Explore More"
        subtitle="Discover more resources to keep learning and growing."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map(({ title, description, href, action, icon: Icon }) => (
          <div
            key={title}
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-gray-200/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/40 dark:hover:shadow-black/20 sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Icon size={22} />
            </div>

            <h3 className="mt-4 font-sora text-lg font-semibold text-gray-900 dark:text-slate-100">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              {description}
            </p>

            <Link
              href={href}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3 dark:text-blue-400"
            >
              {action}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ExploreLearningSection;
