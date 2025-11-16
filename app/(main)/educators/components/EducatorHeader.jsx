import FollowBtn from "@/components/details/FollowBtn";
import { Facebook, Globe, Linkedin, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EducatorHeader = ({
  firstName,
  lastName,
  name,
  image,
  userName,
  educatorProfile,
  totalEnrollments,
  averageRating,
  ratingCount,
  totalFollowers,
  isFollowing,
  isOwner,
}) => {
  const educatorName =
    firstName && lastName ? firstName + " " + lastName : name;

  return (
    <section className="py-12 border-b border-border/50 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
          <Image
            src={image}
            alt={name}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-0.5">
          <h1 className="text-3xl font-bold">{educatorName}</h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            {educatorProfile?.bio}
          </p>
          <p className="text-muted-foreground text-xs ">
            {educatorProfile?.qualification}
          </p>
          <p className="text-muted-foreground text-xs font-semibold">
            {educatorProfile?.expertise.length &&
              educatorProfile?.expertise.map((e) => e + " ")}
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} />
              <span>{averageRating}</span>({ratingCount})
            </div>
            <div className="flex items-center gap-1 text-foreground/80">
              <Users size={16} /> <span>{totalEnrollments} students</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold "> {totalFollowers} Followers </p>
          <FollowBtn
            isOwner={isOwner}
            isFollowing={isFollowing}
            educatorUserName={userName}
          />
          <div className="flex gap-3">
            <Link href={educatorProfile?.socialLinks?.website}>
              <Globe className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href={educatorProfile?.socialLinks?.facebook}>
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-sky-500" />
            </Link>
            <Link href={educatorProfile?.socialLinks?.linkedin}>
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default EducatorHeader;
