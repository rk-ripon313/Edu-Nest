import { Suspense } from "react";

import SectionLoadingFallback from "@/components/SectionLoadingFallback";
import PopularBooks from "@/components/home/PopularBooks";
import PopularSeries from "@/components/home/PopularSeries";

import CreatorSection from "./CreatorSection";
import ExploreLearningSection from "./ExploreLearningSection";
import MyBooksSection from "./MyBooksSection";
import MyStudySeriesSection from "./MyStudySeriesSection";
import WelcomeDashboard from "./WelcomeDashboard";

const UserHome = ({ user }) => {
  return (
    <>
      <Suspense
        fallback={<SectionLoadingFallback title="Your Learning Space" />}
      >
        <WelcomeDashboard user={user} />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="My Books" />}>
        <MyBooksSection userId={user.id} />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="My Study Series" />}>
        <MyStudySeriesSection userId={user.id} />
      </Suspense>

      <ExploreLearningSection />

      <Suspense fallback={<SectionLoadingFallback title="Popular Books" />}>
        <PopularBooks />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Popular Series" />}>
        <PopularSeries />
      </Suspense>

      {user.role === "educator" && <CreatorSection />}
    </>
  );
};

export default UserHome;
