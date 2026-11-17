import SectionWrapper from "@/components/SectionWrapper";
import { BookOpen, GraduationCap, Users } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    title: "Books & Study Series",
    description: "Explore different learning resources in one place.",
  },
  {
    icon: GraduationCap,
    title: "Learn at Your Pace",
    description: "Choose learning materials that fit your goals.",
  },
  {
    icon: Users,
    title: "Educator Community",
    description: "Discover knowledge shared by passionate educators.",
  },
];

const ImpactStats = () => {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
        {stats.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={22} />
            </div>

            <div>
              <h3 className="font-sora font-semibold text-base sm:text-lg text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ImpactStats;
