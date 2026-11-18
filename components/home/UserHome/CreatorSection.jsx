import { ArrowRight, PenLine } from "lucide-react";
import Link from "next/link";

import SectionWrapper from "@/components/SectionWrapper";

const CreatorSection = () => {
  return (
    <SectionWrapper className="pt-0">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PenLine size={22} />
          </div>

          <div>
            <h2 className="font-sora text-lg font-semibold text-foreground">
              Share Your Knowledge
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Create educational content, manage your publications, and share
              your expertise with the EduNest community.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Creator Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </SectionWrapper>
  );
};

export default CreatorSection;
