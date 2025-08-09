import ChangePasswordForm from "../components/ChangePasswordForm";

const ChangePasswordPage = async () => {
  return (
    <section className=" mx-auto space-y-8 p-4">
      <h2 className="text-3xl font-bold mb-2 font-grotesk">Change Password</h2>
      <ChangePasswordForm />
    </section>
  );
};
export default ChangePasswordPage;
