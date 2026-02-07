import { Facebook, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-300 text-muted-foreground px-4 py-8 md:px-12 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-primary">EduNest</h1>
          <p className="text-sm mt-1">Your trusted academic companion.</p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">Explore</span>
            <Link href="/study-series" className="hover:underline">
              Series
            </Link>
            <Link href="/books" className="hover:underline">
              Books
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">Follow</span>
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 hover:text-primary" />

              <Youtube className="w-5 h-5 hover:text-primary" />

              <Linkedin className="w-5 h-5 hover:text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-muted-foreground">
        © {currentYear} EduNest. All rights reserved.{" "}
        <span className="mx-1">•</span>
        <Link
          href="https://rk-ripon313.vercel.app/"
          target="_blank"
          className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Built by RK Ripon
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
