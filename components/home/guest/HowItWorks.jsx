import { ArrowRight, Compass, PlayCircle, ShoppingBag } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Explore",
    description:
      "Browse educational books and study series to discover what interests you.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Choose",
    description:
      "Find the right learning resources and get access to the content you need.",
  },
  {
    number: "03",
    icon: PlayCircle,
    title: "Start Learning",
    description:
      "Access your learning materials and move forward at your own pace.",
  },
];

const HowItWorks = () => {
  return (
    <SectionWrapper>
      <SectionHeader
        align="center"
        title="Start Learning in Three Simple Steps"
        subtitle="Your learning journey with EduNest is simple and straightforward."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map(({ number, icon: Icon, title, description }, index) => (
          <div key={number} className="relative text-center">
            <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
              <Icon size={27} />

              <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {number}
              </span>
            </div>

            <h3 className="mt-5 font-sora text-lg sm:text-xl font-semibold text-foreground">
              {title}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            {index !== steps.length - 1 && (
              <ArrowRight
                className="hidden md:block absolute top-7 -right-6 lg:-right-8 text-muted-foreground/50"
                size={22}
              />
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HowItWorks;
