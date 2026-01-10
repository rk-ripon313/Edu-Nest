import Empty from "@/components/Empty";
import SectionLoadingFallback from "@/components/SectionLoadingFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getEducatorBlogs,
  getEducatorInfoByUserName,
  getEducatorProfileItems,
} from "@/database/queries/educator-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogCard from "../../blogs/components/BlogCard";
import EducatorHeader from "../components/EducatorHeader";
import EducatorSidebar from "../components/EducatorSidebar";
import EducatorTabItems from "../components/EducatorTabItems";

const EducatorProfile = async ({ params: { userName } }) => {
  const educatorInfo = await getEducatorInfoByUserName(userName);
  //console.log({ educatorInfo });
  if (!educatorInfo) notFound();

  // Others items parallel fetch
  const [educatorBooks, educatorSeries, blogs] = await Promise.all([
    getEducatorProfileItems(educatorInfo._id, "Book"),
    getEducatorProfileItems(educatorInfo._id, "StudySeries"),
    getEducatorBlogs(educatorInfo._id.toString()),
  ]);

  return (
    <div className="px-4 py-2">
      <EducatorHeader {...educatorInfo} />

      <Tabs defaultValue="blogs" className="px-6 pb-6 overflow-hidden mt-3">
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

        <TabsContent
          value="blogs"
          className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* LEFT: Blogs */}
          <div className="lg:col-span-2 space-y-6">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
                >
                  <BlogCard blog={blog} />
                </div>
              ))
            ) : (
              <Empty title={" No blogs found for this educator."} />
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <EducatorSidebar
            blogs={blogs}
            educatorSeries={educatorSeries.slice(0, 3)}
            educatorBooks={educatorBooks.slice(0, 3)}
          />
        </TabsContent>

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
