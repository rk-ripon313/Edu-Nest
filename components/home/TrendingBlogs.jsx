import { getBlogs } from "@/database/queries/blogs-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";
import { Button } from "../ui/button";

const TrendingBlogs = async () => {
  const blogs = await getBlogs({ limit: 10 });

  if (!blogs || blogs.length === 0) return null;

  return (
    <SectionWrapper even={true}>
      <div className="flex justify-between items-center gap-2">
        <SectionHeader
          title="Trending Blogs"
          subtitle="Check out the latest popular blogs"
        />
        <Link
          href="/blogs"
          className="text-sm font-sora font-medium text-primary hover:underline flex items-center justify-end gap-1"
        >
          <Button className="text-white font-sora px-2 py-1" size="sm">
            Explore All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <SwiperSlider items={blogs} type="blog" />
    </SectionWrapper>
  );
};

export default TrendingBlogs;
