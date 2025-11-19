import { Button } from "@/components/ui/button";
import Link from "next/link";

const EducatorNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Educator not found</h1>
      <p className="mb-6">
        Sorry, the Educator you&apos;re looking for doesn&apos;t exist or
        isn&apos;t available.
      </p>
      <Link href="/educators" className="">
        <Button>Go to Educator List</Button>
      </Link>
    </div>
  );
};
export default EducatorNotFound;
