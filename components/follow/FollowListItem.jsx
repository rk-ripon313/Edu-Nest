import Image from "next/image";
import Link from "next/link";

const FollowListItem = ({ user, type }) => {
  const name = user?.firstName
    ? user?.firstName + " " + user?.lastName
    : user?.name;

  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
      <div className="flex items-center gap-3">
        <Link
          href={"#"}
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
    </div>
  );
};

export default FollowListItem;
