import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const GlobalNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <Logo />
      <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="mb-6">{`The page you're looking for doesn't exist.`}</p>
      <Link href="/" className="">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
};
export default GlobalNotFound;
