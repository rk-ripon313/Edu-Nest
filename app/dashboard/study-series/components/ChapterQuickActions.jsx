"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EyeOff,
  Lock,
  MoreHorizontal,
  Pencil,
  Trash,
  Unlock,
  Upload,
} from "lucide-react";

const ChapterQuickActions = ({ chapter, studySeriesId }) => {
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" title="Edit Chapter">
        <Pencil className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" title="More Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 z-20 bg-white dark:bg-slate-950">
          <DropdownMenuItem>
            {chapter.access ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Lock
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" /> Unlock
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem>
            {chapter.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> Unpublish
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Publish
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ChapterQuickActions;
