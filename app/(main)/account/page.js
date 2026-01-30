import FollowStats from "@/components/follow/FollowStats";
import { getEnrolledItems } from "@/database/queries/enrollments-data";
import { getCurrentUserWithFollowStats } from "@/lib/current-user";
import Image from "next/image";

const AccountPage = async () => {
  const user = await getCurrentUserWithFollowStats();

  const name = user?.firstName
    ? user?.firstName + " " + user?.lastName
    : user?.name;

  const [enrolledBooks, enrolledSeries] = await Promise.all([
    getEnrolledItems(user?.id, "Book"),
    getEnrolledItems(user?.id, "StudySeries"),
  ]);

  return (
    <div className="container mx-auto p-4">
      {/* User Info */}
      <section className="mb-8 rounded-xl border bg-card p-5">
        <div className="flex flex-col items-center gap-4 sm:items-start sm:flex-row">
          {/* Avatar */}
          <Image
            src={user?.image}
            alt={name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover border shadow-sm"
          />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold leading-tight">{name}</h2>

            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              <span className=" font-semibold text-foreground">Role : </span>
              {user.role}
            </p>

            {/* Followers / Following */}
            <FollowStats
              followers={user.followers ?? []}
              following={user.following ?? []}
            />
            {/* Action */}
            <div className="mt-1.5">
              <a
                href="/account/profile"
                className="inline-block text-xs font-medium text-primary hover:underline"
              >
                Edit Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled Items Count */}
      <section className="space-y-3">
        <div className=" p-3 rounded-lg flex justify-between items-center">
          <span className="font-medium">Total Enrolled Books</span>
          <span className="text-lg font-bold">{enrolledBooks.length}</span>
        </div>
        <div className=" p-3 rounded-lg flex justify-between items-center">
          <span className="font-medium">Total Enrolled Series</span>
          <span className="text-lg font-bold">{enrolledSeries.length}</span>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
