import { getCurrentUser } from "@/lib/session";
import ProfileForm from "../components/ProfileForm";
import ProfileImageEditor from "../components/ProfileImageEditor";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  return (
    <section className=" mx-auto space-y-8 p-4">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-8 border rounded-lg p-6 ">
        <ProfileImageEditor
          image={user?.image}
          name={user?.firstName?.trim() ? user.firstName : user?.name}
        />

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-gray-500">@{user?.userName}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
      </div>
      {/* Profile Fields */}
      <ProfileForm user={user} />
    </section>
  );
};
export default ProfilePage;
