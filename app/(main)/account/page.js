import { redirect } from "next/navigation";

const AccountPage = () => {
  redirect("/account/profile");

  return null;
};
export default AccountPage;
