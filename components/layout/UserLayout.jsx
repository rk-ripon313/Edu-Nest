import Footer from "../Footer";
import MainNav from "../MainNav";

const UserLayout = ({ children }) => {
  return (
    <>
      <MainNav />
      {children}
      <Footer />
    </>
  );
};
export default UserLayout;
