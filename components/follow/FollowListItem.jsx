import { toggleFollow } from "@/app/actions/account/accountActions";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

const FollowListItem = ({ user, type, onUnfollow }) => {
  const name = user?.firstName
    ? user?.firstName + " " + user?.lastName
    : user?.name;

  const unFollow = async () => {
    const res = await toggleFollow({ educatorUserName: user?.userName });

    if (!res.success) {
      toast.error(res.message || "Failed to unfollow user");
    } else {
      toast.success("Unfollowed user");
      onUnfollow?.(user._id.toString());
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
      <div className="flex items-center gap-3">
        <Link
          href={type === "following" ? `/educators/${user?.userName}` : "#"}
          className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted"
        >
          <Image
            src={user?.image || "/avatar-placeholder.png"}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </Link>

        <div>
          <p className="text-sm font-medium leading-tight">{name}</p>
        </div>
      </div>

      <div className="shrink-0">
        {type === "following" ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              unFollow();
            }}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            disabled
            className="h-7 px-3 text-xs"
          >
            Ban
          </Button>
        )}
      </div>
    </div>
  );
};

export default FollowListItem;
