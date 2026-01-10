import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getBlogs } from "@/database/queries/blogs-data";
import BlogFilters from "./components/BlogFilters";
import BlogTabs from "./components/BlogTabs";
import LoadMoreBlogs from "./components/LoadMoreBlogs";

const BLOGS_PER_PAGE = 6;

const BlogPage = async ({ searchParams: { tab, search = "", sort } }) => {
  const currentSort = sort || (tab === "following" ? "latest" : "trending"); // default sort value
  const currentTab = tab === "following" ? "following" : "all"; // default current tab

  // Initial fetch of the first page (page 1)
  const blogs = await getBlogs({
    currentTab,
    search,
    currentSort,
    page: 1,
    limit: BLOGS_PER_PAGE,
  });

  const filterState = {
    currentTab,
    search: search,
    currentSort,
    initialBlogs: blogs,
    limit: BLOGS_PER_PAGE,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* side bar for lg scrren */}
      <aside className="min-h-screen bg-muted dark:bg-slate-700 hidden lg:block lg:col-span-1 px-2 py-4">
        Side bar content for larger screens
      </aside>

      <div className="lg:col-span-3 mx-auto px-4 py-6 space-y-6 ">
        <Tabs className="w-full" value={currentTab}>
          {/* tabs list */}
          <BlogTabs />
          {/* tab contents */}
          <TabsContent
            value={currentTab}
            className="space-y-6  min-w-[320px]  sm:w-[380px] md:w-[600px] lg:w-[650px]  "
          >
            <BlogFilters sort={currentSort} />
            <LoadMoreBlogs filterState={filterState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BlogPage;
