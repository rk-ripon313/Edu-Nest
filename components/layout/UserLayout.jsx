import Footer from "../Footer";
import MainNav from "../MainNav";
import ScrollToTopButton from "../ScrollToUp";

const UserLayout = ({ children }) => {
  return (
    <>
      <MainNav />
      {children}
      <ScrollToTopButton />
      <Footer />
    </>
  );
};
export default UserLayout;
