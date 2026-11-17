import {
  BookOpenCheck,
  GraduationCap,
  MonitorPlay,
  ShieldCheck,
} from "lucide-react";

import SectionWrapper from "@/components/SectionWrapper";

const benefits = [
  {
    icon: BookOpenCheck,
    title: "Curated Learning Resources",
    description:
      "Explore educational books and study series in one learning platform.",
  },
  {
    icon: GraduationCap,
    title: "Educator-Led Knowledge",
    description:
      "Discover educational content shared by educators across different subjects.",
  },
  {
    icon: MonitorPlay,
    title: "Flexible Learning",
    description:
      "Choose your learning materials and study according to your own pace.",
  },
  {
    icon: ShieldCheck,
    title: "Organized Learning Space",
    description:
      "Keep your learning resources accessible through your personal account.",
  },
];

const TrustSection = () => {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
        <div>
          <span className="text-sm font-semibold text-primary">
            WHY EDUNEST
          </span>

          <h2 className="mt-3 font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            A Better Space for Your Learning Journey
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            Learning should be accessible, organized, and meaningful. EduNest
            brings learning resources and educators together to help you move
            forward with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={21} />
              </div>

              <h3 className="mt-4 font-sora font-semibold text-base text-foreground">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TrustSection;
