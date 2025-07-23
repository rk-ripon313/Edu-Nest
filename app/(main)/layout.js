import UserLayout from "@/components/layout/UserLayout";

const MainLayout = ({ children }) => {
  return (
    <UserLayout>
      <main>{children}</main>
    </UserLayout>
  );
};
export default MainLayout;
