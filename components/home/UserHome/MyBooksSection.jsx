import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import Empty from "@/components/Empty";
import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";
import { getEnrolledItems } from "@/database/queries/enrollments-data";

import EnrolledItemCard from "./EnrolledItemCard";

const MyBooksSection = async ({ userId }) => {
  const books = await getEnrolledItems(userId, "Book", {
    sort: "latest",
    limit: 3,
  });

  return (
    <SectionWrapper>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeader
          title="My Books"
          subtitle="Pick up where you left off in your personal library."
        />

        <Link
          href="/account/enrolled-books"
          className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <EnrolledItemCard key={book.id} item={book} type="book" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <Empty
            title="Your library is empty"
            subTitle="Explore educational books and find something interesting to read."
            icon={BookOpen}
            variant="compact"
          />

          <div className="flex justify-center pb-6">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Explore Books
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default MyBooksSection;
