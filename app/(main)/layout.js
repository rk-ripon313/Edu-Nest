import UserLayout from "@/components/layout/UserLayout";
import { SessionProvider } from "next-auth/react";

const MainLayout = ({ children }) => {
  return (
    <SessionProvider>
      <UserLayout>
        <main>{children}</main>
      </UserLayout>
    </SessionProvider>
  );
};
export default MainLayout;
