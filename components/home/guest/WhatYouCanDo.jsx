import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  GraduationCap,
  PenLine,
  Video,
} from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/SectionHeader";
import SectionWrapper from "@/components/SectionWrapper";

const features = [
  {
    icon: BookOpen,
    title: "Learn Something New",
    description:
      "Discover books and study series designed to help you build knowledge and develop new skills.",
    items: ["Explore study materials", "Access learning resources"],
    href: "/books",
    action: "Explore Learning",
  },
  {
    icon: GraduationCap,
    title: "Share Your Knowledge",
    description:
      "Educators can publish educational content and share their expertise with learners.",
    items: ["Publish books and series", "Build your audience"],
    href: "/register",
    action: "Become an Educator",
  },
];

const WhatYouCanDo = () => {
  return (
    <SectionWrapper>
      <SectionHeader
        align="center"
        title="Everything You Need to Learn & Teach"
        subtitle="Whether you're here to learn or share knowledge, EduNest gives you the tools to grow."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 transition-colors hover:border-primary/40"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} />
              </div>

              <h3 className="mt-5 font-sora text-xl sm:text-2xl font-semibold text-foreground">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <ul className="mt-5 space-y-3">
                {feature.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  {feature.action}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: BookMarked, label: "Digital Books" },
          { icon: Video, label: "Study Series" },
          { icon: PenLine, label: "Educational Content" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-3 rounded-xl bg-muted/60 dark:bg-muted/30 px-4 py-4"
          >
            <Icon size={19} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default WhatYouCanDo;
