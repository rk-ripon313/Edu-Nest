import { Suspense } from "react";

import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import SectionLoadingFallback from "@/components/SectionLoadingFallback";

import GuestCTA from "./GuestCTA";
import HowItWorks from "./HowItWorks";
import ImpactStats from "./ImpactStats";
import TrustSection from "./TrustSection";
import WhatYouCanDo from "./WhatYouCanDo";

import PopularBooks from "@/components/home/PopularBooks";
import PopularSeries from "@/components/home/PopularSeries";
import TopEducatos from "@/components/home/TopEducatos";
import TopRatedBooks from "@/components/home/TopRatedBooks";
import TopRatedSeries from "@/components/home/TopRatedSeries";
import TrendingBlogs from "@/components/home/TrendingBlogs";

const GuestHome = () => {
  return (
    <>
      <Hero />
      <Categories />

      <ImpactStats />
      <WhatYouCanDo />
      <HowItWorks />
      <TrustSection />

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

      <GuestCTA />
    </>
  );
};

export default GuestHome;
