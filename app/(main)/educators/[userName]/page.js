import SectionLoadingFallback from "@/components/SectionLoadingFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getEducatorInfoByUserName,
  getEducatorProfileItems,
} from "@/database/queries/educator-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EducatorHeader from "../components/EducatorHeader";
import EducatorTabItems from "../components/EducatorTabItems";

const EducatorProfile = async ({ params: { userName } }) => {
  const educatorInfo = await getEducatorInfoByUserName(userName);
  //console.log({ educatorInfo });
  if (!educatorInfo) notFound();

  // Others items parallel fetch
  const [educatorBooks, educatorSeries] = await Promise.all([
    getEducatorProfileItems(educatorInfo._id, "Book"),
    getEducatorProfileItems(educatorInfo._id, "StudySeries"),
  ]);

  return (
    <div className="px-4 py-2">
      <EducatorHeader {...educatorInfo} />

      <Tabs defaultValue="series" className="px-6 pb-6 overflow-hidden mt-3">
        <TabsList className="p-1 rounded-md border mb-4 gap-2 bg-muted dark:bg-gray-950 text-sm">
          <TabsTrigger
            value="blogs"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Blogs
          </TabsTrigger>
          <TabsTrigger
            value="series"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Study Series
          </TabsTrigger>
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Books
          </TabsTrigger>
        </TabsList>

        {/*  Tabs Contents */}
        <TabsContent value="blogs">UPCOMING ...</TabsContent>

        {/* series */}
        <TabsContent value="series">
          <Suspense fallback={<SectionLoadingFallback title="study-Series" />}>
            <EducatorTabItems items={educatorSeries} type="series" />
          </Suspense>
        </TabsContent>

        {/* books */}
        <TabsContent value="books">
          <Suspense fallback={<SectionLoadingFallback title="Books" />}>
            <EducatorTabItems items={educatorBooks} type="book" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default EducatorProfile;
