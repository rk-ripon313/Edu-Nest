import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import SectionLoadingFallback from "@/components/SectionLoadingFallback";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const TopRatedBooks = dynamic(() => import("@/components/home/TopRatedBooks"), {
  suspense: true,
});
const TopRatedSeries = dynamic(
  () => import("@/components/home/TopRatedSeries"),
  { suspense: true },
);
const TopEducatos = dynamic(() => import("@/components/home/TopEducatos"), {
  suspense: true,
});
const TrendingBlogs = dynamic(() => import("@/components/home/TrendingBlogs"), {
  suspense: true,
});
const PopularBooks = dynamic(() => import("@/components/home/PopularBooks"), {
  suspense: true,
});
const PopularSeries = dynamic(() => import("@/components/home/PopularSeries"), {
  suspense: true,
});

const MainPage = () => {
  return (
    <>
      <Hero />
      <Categories />

      <Suspense fallback={<SectionLoadingFallback title="Top Rated Books" />}>
        <TopRatedBooks />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Top Rated Series" />}>
        <TopRatedSeries />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Popular Educators" />}>
        <TopEducatos />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Trending Blogs" />}>
        <TrendingBlogs />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Popular Books" />}>
        <PopularBooks />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Popular Series" />}>
        <PopularSeries />
      </Suspense>
    </>
  );
};

export default MainPage;
