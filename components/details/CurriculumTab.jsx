import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { editYouTubeUrl, formatDuration } from "@/lib/formetData";
import { Clock, Lock, Play } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import PlayPreviewVideo from "./PlayPreviewVideo";

const CurriculumTab = ({ chapters }) => {
  return (
    <TabsContent
      value="curriculum"
      className="md:w-5/6 lg:w-4/5 space-y-4 sm:text-sm "
    >
      <h2 className="text-xl font-semibold">Curriculum</h2>
      <Accordion
        defaultValue={[chapters[0]._id.toString()]}
        type="multiple"
        className="w-full"
      >
        {chapters.map((chapter) => (
          <AccordionItem
            key={chapter._id.toString()}
            value={chapter._id.toString()}
          >
            <AccordionTrigger>
              <div className="flex justify-between w-full items-center px-2">
                <span className="font-medium">{chapter.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 space-y-3">
              {chapter?.lessonIds.length > 0 ? (
                chapter?.lessonIds?.map((lesson) => (
                  <div
                    key={lesson._id.toString()}
                    className="flex justify-between items-center border-b pb-1 text-sm bg-light_bg dark:bg-dark_bg px-1.5 py-1 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isPreview ? (
                        <Play className="w-4 h-4 text-primary" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground opacity-60" />
                      )}
                      <span
                        className={
                          !lesson.isPreview
                            ? "opacity-60 text-muted-foreground"
                            : ""
                        }
                      >
                        🎬 {lesson.title}
                      </span>
                      {lesson.isPreview && (
                        <PlayPreviewVideo
                          videoUrl={editYouTubeUrl(lesson?.videoUrl)}
                        />
                      )}
                    </div>

                    <span className="flex items-center gap-1 opacity-60">
                      <Clock className="w-4 h-4" />
                      {formatDuration(lesson.duration)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center border-b pb-1 text-sm">
                  <p className="font-semibold"> This Chapter is Empty</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  );
};

export default CurriculumTab;
