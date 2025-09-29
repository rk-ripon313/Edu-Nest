import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import DashBoardNavbar from "./components/DashboardNav";
import Sidebar from "./components/Sidebar";

const DashboardLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "educator") {
    redirect("/");
  }

  return (
    <div className="h-dvh w-full ">
      {/* Top Navbar */}
      <div className="h-[64px] lg:pl-72 fixed inset-y-0 w-full z-50">
        <DashBoardNavbar />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-dvh w-72 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="pt-[64px] lg:pl-72 ">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
};
export default DashboardLayout;
