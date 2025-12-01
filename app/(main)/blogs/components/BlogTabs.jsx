"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

const BlogTabs = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "all";

  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    // params.set("tab", value);
    if (value === "all") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <TabsList className="bg-gray-100 dark:bg-gray-700 mb-3">
      <TabsTrigger
        value="all"
        onClick={() => handleTabChange("all")}
        data-state={currentTab === "all" ? "active" : "inactive"}
        className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-600"
      >
        All Blogs
      </TabsTrigger>

      <TabsTrigger
        value="following"
        onClick={() => handleTabChange("following")}
        data-state={currentTab === "following" ? "active" : "inactive"}
        className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-600"
      >
        Following
      </TabsTrigger>
    </TabsList>
  );
};

export default BlogTabs;
