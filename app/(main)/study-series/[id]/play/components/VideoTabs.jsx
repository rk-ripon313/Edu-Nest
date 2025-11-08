"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlay } from "@/context/PlayContext";

const VideoTabs = ({}) => {
  const { currentLesson } = usePlay();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-b-lg mt-2">
      {currentLesson && (
        <Tabs defaultValue="overview" className="p-4">
          <TabsList className="p-4  dark:bg-slate-950 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Resources
            </TabsTrigger>
            {/* <TabsTrigger
              value="discussion"
              className="data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Discussion
            </TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold">{currentLesson.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentLesson?.description || "No overview available."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card>
              <CardContent className="p-4">
                {currentLesson?.resources?.length > 0 ? (
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    {currentLesson.resources.map((res) => (
                      <div className="p-2 mb-1" key={res?._id}>
                        <h4 className="font-semibold">{res.title}</h4>
                        <li className="list-none">{res.url} </li>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No resources provided.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discussion Tab */}
        </Tabs>
      )}
    </div>
  );
};
export default VideoTabs;
