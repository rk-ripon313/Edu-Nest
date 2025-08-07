import { getCurrentUser } from "@/lib/session";
import AccountSidebar from "./components/AccountSidebar";

const AccountLayout = async ({ children }) => {
  const crrUser = await getCurrentUser();
  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside className="  md:w-64  border-b md:border-r border-muted bg-muted/20">
        <AccountSidebar role={crrUser?.role} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default AccountLayout;
