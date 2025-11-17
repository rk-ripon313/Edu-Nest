import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formetPrice";
import { BookOpen, List, StarIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ActionBtns from "./ActionBtns";
import FollowBtn from "./FollowBtn";
const ItemCardHeader = async ({ item, isSeries }) => {
  const name =
    item?.educator?.firstName && item?.educator?.lastName
      ? item.educator.firstName + " " + item.educator.lastName
      : item.educator?.name;
  return (
    <div className="flex flex-col md:flex-row  shadow-lg overflow-hidden">
      {/* Thumbnail */}
      <div className="md:w-1/3 relative bg-muted/50 p-6 flex items-center justify-center rounded-lg overflow-hidden aspect-[4/3] md:aspect-auto">
        {/* Book or Series Label */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-primary/90 text-white px-3 py-1.5 rounded-md shadow-md backdrop-blur-md">
          {isSeries ? (
            <>
              <List className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">
                Series
              </span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">Book</span>
            </>
          )}
        </div>
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Main Details */}
      <div className="md:w-2/3 p-6 space-y-4">
        <h1 className="text-3xl font-bold leading-snug">{item.title}</h1>

        {/* Category */}
        <div className="flex flex-wrap gap-2">
          {item.category?.label && (
            <Badge variant="default">{item.category.label}</Badge>
          )}
          {item.category?.group && (
            <Badge variant="secondary">{item.category.group}</Badge>
          )}
          {item.category?.subject && (
            <Badge variant="outline">{item.category.subject}</Badge>
          )}
          {item.category?.part && (
            <Badge variant="destructive">Part {item.category.part}</Badge>
          )}
        </div>

        {/* Educator */}
        <div className="flex items-center gap-4 ">
          <Link href={`/educators/${item.educator?.userName}`}>
            <Avatar className="bg-secondary">
              <AvatarImage src={item.educator?.image || ""} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/educators/${item.educator?.userName}`}>
              <h4 className="font-medium">{name}</h4>
            </Link>

            <div className="flex justify-center items-center gap-2">
              {/* follow/unFollow actions */}
              <FollowBtn
                isOwner={item?.isOwner}
                isFollowing={item?.isFollowing}
                educatorUserName={item.educator?.userName}
              />
              <span className="font-semibold ">
                ( {item?.educatorFollowers} )
              </span>
            </div>
          </div>
        </div>
        {/* Ratings + Enrollments */}
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(item?.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              ></StarIcon>
            ))}
            <span className="">({item?.ratingCount || 0} )</span>
          </div>
          <span>|</span>
          <span className="flex justify-between items-center gap-1">
            <Users className="w-4 h-4" /> {item.totalEnrollments || 0}
          </span>
        </div>

        {/* Price */}
        <div>
          <span className="text-2xl font-semibold text-foreground">
            {item.price > 0 ? `${formatPrice(item?.price)}` : "Free"}
          </span>
        </div>

        {/* CTA */}

        <ActionBtns
          itemId={item?.id}
          price={item?.price}
          isOwner={item?.isOwner}
          isEnrolled={item?.isEnrolled}
          isSeries={isSeries}
        />
      </div>
    </div>
  );
};
export default ItemCardHeader;
