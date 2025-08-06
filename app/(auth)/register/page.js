import Link from "next/link";
import RegisterForm from "../components/RegisterForm";
import SocialLogins from "../components/SocialLogin";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl space-y-4 container dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-center text-primary">
          Create an Account
        </h2>
        <RegisterForm />
        <SocialLogins />

        <p className="text-sm text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
