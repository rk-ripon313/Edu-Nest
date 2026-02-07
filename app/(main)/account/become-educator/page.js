import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import EducatorForm from "../components/EducatorForm";

const BecomeEducatorPage = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  // already educator → go to profile
  if (user.role === "educator") {
    redirect("/account/educator-profile");
  }

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 font-grotesk">
        Become an Educator
      </h1>
      <p className="text-muted-foreground  mb-6">
        Fill out the form to apply as an educator.
      </p>
      <EducatorForm currentUserName={user?.userName} initialData={""} />
    </div>
  );
};
export default BecomeEducatorPage;
