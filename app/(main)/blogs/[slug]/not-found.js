import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlogNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Blog Not Found !</h1>
      <p className="mb-6">
        Sorry, the Blog you&apos;re looking for doesn&apos;t exist or isn&apos;t
        available.
      </p>
      <Link href="/blogs" className="">
        <Button>Go to Blog List</Button>
      </Link>
    </div>
  );
};
export default BlogNotFound;
