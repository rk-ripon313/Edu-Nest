import { getAllEducators } from "@/database/queries/educator-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";
import { Button } from "../ui/button";

const TopEducatos = async () => {
  const educators = await getAllEducators({ limit: 12 });

  if (!educators || educators.length === 0) return null;

  return (
    <SectionWrapper>
      <div className="flex justify-between items-center gap-2">
        <SectionHeader
          title="Popular Educators"
          subtitle="Learn from top-rated and experienced educators"
        />

        <Link
          href="/educators"
          className="text-sm font-sora font-medium text-primary hover:underline flex items-center justify-end gap-1"
        >
          <Button className="text-white font-sora px-2 py-1" size="sm">
            Explore All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <SwiperSlider items={educators} type="educator" />
    </SectionWrapper>
  );
};
export default TopEducatos;
