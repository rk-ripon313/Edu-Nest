import GuestHome from "@/components/home/guest/GuestHome";
import UserHome from "@/components/home/UserHome/UserHome";
import { getCurrentUser } from "@/lib/session";

const MainPage = async () => {
  const user = await getCurrentUser();

  return user ? <UserHome user={user} /> : <GuestHome />;
};

export default MainPage;
