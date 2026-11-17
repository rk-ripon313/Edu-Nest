import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import SectionWrapper from "@/components/SectionWrapper";

const GuestCTA = () => {
  return (
    <SectionWrapper>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/50 dark:bg-muted/20 px-6 py-12 sm:px-10 lg:py-16 text-center">
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap size={29} />
          </div>

          <h2 className="mt-5 font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Your Learning Journey Starts Here
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            Discover new knowledge, explore educational resources, and take the
            next step toward your learning goals with EduNest.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GuestCTA;
