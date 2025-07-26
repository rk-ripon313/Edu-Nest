import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className = "" }) => {
  return (
    <Link
      href="/"
      className={cn("relative  min-w-[120px] h-[70px]", className)}
    >
      <Image
        src="/logo.png"
        alt="logo"
        fill
        priority
        className="object-contain w-full h-full scale-[2]"
      />
    </Link>
  );
};
export default Logo;
