import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

import SectionWrapper from "@/components/SectionWrapper";
import { getEnrollmentStats } from "@/database/queries/enrollments-data";

const WelcomeDashboard = async ({ user }) => {
  const stats = await getEnrollmentStats(user.id);

  const name = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.name || "there";

  const items = [
    {
      label: "Enrolled Books",
      count: stats.enrolledBooksCount,
      icon: BookOpen,
      href: "/account/enrolled-books",
    },
    {
      label: "Study Series",
      count: stats.enrolledSeriesCount,
      icon: GraduationCap,
      href: "/account/enrolled-study-series",
    },
  ];

  return (
    <SectionWrapper className="pb-6 sm:pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-400/10" />

        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
              Your Learning Space
            </p>

            <h1 className="mt-2 font-sora text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 sm:text-3xl">
              Welcome back, {name}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-slate-400 sm:text-base">
              Keep learning, discover new resources, and share your knowledge
              with the EduNest community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[310px]">
            {items.map(({ label, count, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-blue-500/50 dark:hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon
                    size={19}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <ArrowUpRight
                    size={16}
                    className="text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-500"
                  />
                </div>

                <p className="mt-3 font-sora text-2xl font-bold tabular-nums text-gray-900 dark:text-slate-50">
                  {count}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-slate-400 sm:text-sm">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WelcomeDashboard;
