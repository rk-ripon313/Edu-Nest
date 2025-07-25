"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TabListNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { label: "Books", href: "/books" },
    { label: "Study Series", href: "/study-series" },
  ];

  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.href ?? "/study-series";

  const currentQuery = searchParams.toString();

  const onTabChange = (value) => {
    let url = value;
    if (currentQuery) {
      url += `?${currentQuery}`;
    }
    router.push(url);
  };

  return (
    <div className="flex justify-center my-6">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="rounded-md shadow-sm bg-muted dark:bg-slate-800"
      >
        <TabsList className="rounded-md p-1 bg-muted/30 dark:bg-muted/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className={`
                text-base font-semibold px-4 py-2 rounded-md transition-colors
                ${
                  activeTab === tab.href
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }
              `}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabListNav;
