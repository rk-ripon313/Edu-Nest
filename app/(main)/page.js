import GuestHome from "@/components/home/guest/GuestHome";
import { getCurrentUser } from "@/lib/session";

const MainPage = async () => {
  const user = await getCurrentUser();
  const name = user?.firstName
    ? user?.firstName + " " + user?.lastName
    : user?.name;
  return user ? <p>welcome{name} </p> : <GuestHome />;
};

export default MainPage;
