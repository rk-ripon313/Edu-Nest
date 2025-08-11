import { getEnrolledItems } from "@/database/queries/enrollments-data";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

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
      <section className="mb-8 flex items-center gap-4  p-4 rounded-lg shadow-sm">
        <Image
          src={user?.image}
          alt={name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="">{user.email}</p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
          <a
            href="/account/profile"
            className="text-blue-600 underline text-sm mt-1 inline-block"
          >
            Edit Profile
          </a>
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
