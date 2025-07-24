import { getUniqueCategories } from "@/database/queries/categories-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import { Button } from "../ui/button";

const Categories = async ({}) => {
  const { labelSet, groupSet } = await getUniqueCategories();
  const labels = Array.from(labelSet);
  const groups = Array.from(groupSet);
  return (
    <SectionWrapper even={true}>
      <div className="flex justify-between items-center gap-2">
        <SectionHeader
          title="Browse by Category"
          subtitle="Find books and study series based on your interest."
        />

        <Link
          href="/study-series"
          className="text-sm font-sora font-medium text-primary hover:underline flex items-center justify-end gap-1"
        >
          <Button className="text-white font-sora px-2 py-1" size="sm">
            Explore All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        {labels.map((label) => (
          <Link
            key={label}
            href={`/study-series?label=${label.toLowerCase()}`}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition text-sm"
          >
            {label}
          </Link>
        ))}
        {groups.map((group) => (
          <Link
            key={group}
            href={`/study-series?group=${group.toLowerCase()}`}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition text-sm"
          >
            {group}
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Categories;
