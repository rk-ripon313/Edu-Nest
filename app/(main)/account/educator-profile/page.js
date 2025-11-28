import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import EducatorForm from "../components/EducatorForm";

const EducatorProfile = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "educator") {
    redirect("/account/become-educator");
  }

  return (
    <section className=" mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 font-grotesk">Educator Profile</h1>
      <p className="text-muted-foreground  mb-6">You may edit your profile.</p>
      <EducatorForm
        currentUserName={user?.userName}
        initialData={user?.educatorProfile}
      />
    </section>
  );
};
export default EducatorProfile;
