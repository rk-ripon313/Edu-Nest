import Link from "next/link";
import LoginForm from "../components/LoginForm";
import SocialLogins from "../components/SocialLogin";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl space-y-4 container dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-center text-primary">
          Login to your account
        </h2>

        <LoginForm />
        <SocialLogins />

        {/* Register link */}
        <p className="text-sm text-center text-muted-foreground mt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
