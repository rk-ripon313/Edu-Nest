"use client";
import { deleteBlog } from "@/app/actions/blog.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";

const BlogActionsDropdown = ({ isOwnBlog, blogId }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="transition cursor-pointer pointer-events-auto"
          size="icon"
          variant="ghost"
          title="Blog Actions"
        >
          <MoreHorizontal size={20} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-32 z-20 bg-white dark:bg-slate-950"
      >
        {isOwnBlog ? (
          <>
            <DropdownMenuItem
              className=" cursor-pointer "
              onClick={() => {
                setOpen(false);
                router.push(`/dashboard/blogs/${blogId}/edit`);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <ConfirmDialog
                title="Delete blog?"
                description="This blog will be permanently deleted."
                confirmText="Delete"
                onConfirm={async () => {
                  try {
                    const res = await deleteBlog(blogId);

                    if (res.success) {
                      setOpen(false);
                      toast.success(res?.message || "Deleted");
                      router.refresh();
                    } else {
                      toast.error("Failed to delete blog");
                    }
                  } catch (error) {
                    toast.error("Failed to delete blog");
                  }
                }}
                trigger={
                  <button className="text-left p-1 rounded-md w-full  transition text-red-600 hover:bg-red-700 hover:text-white">
                    Delete
                  </button>
                }
              />
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>Report</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlogActionsDropdown;
