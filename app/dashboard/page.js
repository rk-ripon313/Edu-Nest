import FollowStats from "@/components/follow/FollowStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEducatorDashboardData } from "@/database/queries/dashboard-data";
import { getCurrentUserWithFollowStats } from "@/lib/current-user";
import { formatDate } from "@/lib/formetData";
import { formatPrice } from "@/lib/formetPrice";
import {
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  Star,
  StarIcon,
  Users,
  VideoIcon,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const DashboardHome = async () => {
  const [{ stats, recentEnrollments, recentReviews }, user] = await Promise.all(
    [getEducatorDashboardData(), getCurrentUserWithFollowStats()],
  );

  // console.log({ stats, recentEnrollments, recentReviews });
  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, Educator 👋
        </h1>
        <p className="text-muted-foreground">
          Track your earnings, student engagement, and published content — all
          in one place.
        </p>
      </header>

      {/*  Earnings Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Earnings Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* total icome */}
          <StatsCard
            bg="from-purple-600 to-violet-700"
            title="Total Revenue"
            icon={<DollarSign />}
            subTitle="Total earnings generated from all enrollments"
          >
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
          </StatsCard>
          {/* totla withdrow */}
          <StatsCard
            bg="from-emerald-500 to-green-600"
            title="Withdrawn"
            icon={<Wallet />}
            subTitle="Funds successfully transferred to your account"
          >
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalWithdrawn)}
            </div>
          </StatsCard>
          {/* remaining */}
          <StatsCard
            bg=" from-cyan-500 to-sky-600"
            title="Remaining Balance"
            icon={<Clock />}
            subTitle="Earnings awaiting your next withdrawal cycle"
          >
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue - stats.totalWithdrawn)}
            </div>
          </StatsCard>
        </div>
      </section>

      {/* Social Engagement */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Social Engagement</h2>
        <div className="flex items-center justify-between rounded-lg border border-muted bg-muted/30 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Community</h3>
            <p className="text-xs text-muted-foreground">
              Your audience growth
            </p>
          </div>
          <FollowStats
            followers={user.followers ?? []}
            following={user.following ?? []}
          />
        </div>
      </section>

      {/*  Engagement Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Engagement Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/*  Enrollments Card */}
          <StatsCard
            bg="from-orange-500 to-amber-600"
            title="Enrollments"
            icon={<Users />}
            subTitle="Total learners enrolled in your content"
          >
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs mt-2 text-white/70">
              📚 Books:{" "}
              <span className="font-semibold text-white">
                {stats.bookEnrollmentsCount}
              </span>{" "}
              &nbsp; | &nbsp; 🎓 Series:{" "}
              <span className="font-semibold text-white">
                {stats.seriesEnrollmentsCount}
              </span>
            </p>
          </StatsCard>

          {/*  Rating Card */}
          <StatsCard
            bg="from-pink-500 to-rose-600"
            title="Average Rating"
            icon={<Star />}
            subTitle="Based on feedback from enrolled students"
          >
            <div className="flex items-baseline gap-2">
              <StarIcon className="text-yellow-500" />
              <div className="text-2xl font-bold">{stats.avgRating}</div>
              <p className="text-xs text-white/80">( {stats.totalRating} )</p>
            </div>
          </StatsCard>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/dashboard/books/add"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Book
          </Link>
          <Link
            href="/dashboard/study-series/add"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Study Series
          </Link>
          <Link
            href="/dashboard/blogs/add"
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
          >
            + Add Blog
          </Link>
        </div>
      </section>

      {/*  Content Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Content Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* series */}
          <StatsCard
            bg="from-green-500 to-emerald-600"
            title="Study Series"
            icon={<VideoIcon />}
            subTitle="Active study series live on the platform"
          >
            <div className="text-2xl font-bold">
              {stats?.totalPublishedSeries}{" "}
            </div>
          </StatsCard>
          {/* books */}
          <StatsCard
            bg="from-blue-600 to-indigo-500"
            title="Books Published"
            icon={<BookOpen />}
            subTitle="Published books available for learners"
          >
            <div className="text-2xl font-bold">
              {" "}
              {stats?.totalPublishedBooks}
            </div>
          </StatsCard>

          {/* blogs */}
          <StatsCard
            bg="from-pink-500 to-fuchsia-600"
            title="Blogs"
            icon={<FileText />}
            subTitle="Articles shared to showcase your expertise"
          >
            <div className="text-2xl font-bold">
              {stats?.totalPublishedBlogs}{" "}
            </div>
          </StatsCard>
        </div>
      </section>

      {/*  Recent Enrollments & Reviews */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Recent Enrollments */}
        <Card className="shadow-md bg-white dark:bg-slate-950">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEnrollments?.length ? (
              recentEnrollments.map((item) => (
                <div
                  key={item._id.toString()}
                  className="flex justify-between border-b pb-2 last:border-none last:pb-0"
                >
                  <div className="flex items-center  gap-2">
                    {item.onModel === "Book" ? <BookOpen /> : <VideoIcon />}
                    <div className="">
                      <p className="font-medium">
                        {item?.student?.firstName
                          ? `${item.student?.firstName} ${item.student?.lastName}`
                          : item?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enrolled in {item.content?.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                No recent enrollments yet.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Recent Reviews */}
        <Card className="shadow-md  bg-white dark:bg-slate-950">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEnrollments?.length ? (
              recentReviews.map((item) => (
                <div
                  key={item._id.toString()}
                  className="flex justify-between border-b pb-2 last:border-none last:pb-0"
                >
                  <div className="flex items-center  gap-2">
                    {item.onModel === "Book" ? <BookOpen /> : <VideoIcon />}
                    <div className="">
                      <p className="font-medium">
                        {item?.student?.firstName
                          ? `${item.student?.firstName} ${item.student?.lastName}`
                          : item?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>{item.rating} ★ </strong> on{" "}
                        {item.content?.title}
                      </p>
                      <p className="font-semibold text-xs text-muted-foreground">
                        “{item?.comment}”
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No recent Reviews yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardHome;

//helper component
const StatsCard = ({ bg, title, icon, subTitle, children }) => {
  return (
    <Card
      className={`${bg} bg-gradient-to-br  text-white border-none shadow-md hover:scale-[1.02] transition-transform`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {children}
        <p className="text-xs text-white/80 mt-1">{subTitle}</p>
      </CardContent>
    </Card>
  );
};
