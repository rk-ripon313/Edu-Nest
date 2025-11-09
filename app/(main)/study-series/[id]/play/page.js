import Empty from "@/components/Empty";

import ReviewAction from "@/components/details/ReviewAction";
import Progress from "@/components/Progress";

import { PlayProvider } from "@/context/PlayContext";
import { getHasEnrollment } from "@/database/queries/enrollments-data";
import { getStudySeriesForPlay } from "@/database/queries/study-series-data";
import { getTestimonials } from "@/database/queries/testimonials-data";
import { getCurrentUser } from "@/lib/session";
import ChapterList from "./components/ChapterList";
import VideoTabs from "./components/VideoTabs";
//  lazy load VideoPlayer
const VideoPlayer = dynamic(() => import("./components/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh] text-gray-400">
      Loading video...
    </div>
  ),
});

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const PlayPage = async ({ params: { id } }) => {
  const [user, studySeries, hasEnrollment, testimonials] = await Promise.all([
    getCurrentUser(),
    getStudySeriesForPlay(id),
    getHasEnrollment("StudySeries", id),
    getTestimonials("StudySeries", id),
  ]);
  // console.log({ studySeries }, { hasEnrollment });
  // console.log(studySeries.currentWatch);

  if (!user) return redirect("/login");

  if (!studySeries) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty title="This Study-Series is no longer available" />
      </div>
    );
  }

  if (!hasEnrollment && studySeries) return redirect(`/study-series/${id}`);

  const writedReview = testimonials.find(
    ({ student }) => student?._id?.toString() === user.id
  );
  return (
    <PlayProvider
      chapters={studySeries?.chapters}
      currentWatch={studySeries?.currentWatch}
    >
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white font-grotesk ">
          {studySeries.title}
        </h1>
      </header>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
        {/* Player part - 2/3 width on lg */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-[70vh] bg-black" />}>
            <VideoPlayer studySeriesId={id} />
          </Suspense>
          <VideoTabs />
        </div>
        {/* Chapter list - 1/3 width on lg */}
        <div className="lg:col-span-1  bg-white dark:bg-gray-800 mb-1 rounded-md shadow-md">
          {/* reviews CRUD */}
          <ReviewAction
            onModel="StudySeries"
            review={writedReview}
            itemId={id}
          />

          {/* progress */}
          <div className="px-2 py-1">
            <h3 className="font-semibold font-grotesk">Your Progress.</h3>
            <Progress variant="success" value={studySeries.totalProgress} />
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 text-center">
              {studySeries.totalProgress}% completed
            </p>
          </div>
          {/* chapter list */}
          <ChapterList chapters={studySeries?.chapters} />
        </div>
      </section>
    </PlayProvider>
  );
};
export default PlayPage;
