import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formetData";
import { BookOpen, List, StarIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "../SectionWrapper";
import ActionBtns from "./ActionBtns";

const ItemDetails = ({ item, series = false }) => {
  return (
    <SectionWrapper>
      {/* header or card part */}
      <div className="flex flex-col md:flex-row  shadow-lg overflow-hidden">
        {/* Thumbnail */}
        <div className="md:w-1/3 relative bg-muted/50 p-6 flex items-center justify-center rounded-lg overflow-hidden aspect-[4/3] md:aspect-auto">
          {/* Book or Series Label */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-primary/90 text-white px-3 py-1.5 rounded-md shadow-md backdrop-blur-md">
            {series ? (
              <>
                <List className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">
                  Series
                </span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">
                  Book
                </span>
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
            <Link href={`/educator/${item.educator?.userName}`}>
              <Avatar className="bg-secondary">
                <AvatarImage src={item.educator?.image || ""} />
                <AvatarFallback>
                  {item.educator?.firstName?.charAt(0)}
                  {item.educator?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h4 className="font-medium">
                {item.educator?.firstName} {item.educator?.lastName}
              </h4>
              <button className="text-sm font-sora font-medium text-primary hover:underline">
                Follow
              </button>
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
              {item.price > 0 ? `৳${item.price.toFixed(2)}` : "Free"}
            </span>
          </div>

          {/* CTA */}

          <ActionBtns />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="px-6 pb-6">
        <TabsList className="p-1 rounded-md border mb-4 gap-2 bg-muted dark:bg-gray-950">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
          >
            Description & Outcomes
          </TabsTrigger>

          {series && item.chapters?.length > 0 && (
            <TabsTrigger
              value="curriculum"
              className="data-[state=active]:bg-amber-400 data-[state=active]:font-semibold text-base "
            >
              Curriculum
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Content */}
        <div className="md:flex gap-6">
          {/* overviewTab */}
          <TabsContent value="overview" className="md:w-1/3 space-y-4 text-sm">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>

            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Category:
              </h3>
              <ul className="text-muted-foreground space-y-1 ml-2">
                {item.category?.label && (
                  <li>
                    <span className="font-medium text-foreground">
                      Label :{" "}
                    </span>
                    {item?.category?.label}
                  </li>
                )}
                {item?.category?.group && (
                  <li>
                    <span className="font-medium text-foreground">
                      Group :{" "}
                    </span>
                    {item?.category?.group}
                  </li>
                )}
                {item.category?.subject && (
                  <li>
                    <span className="font-medium text-foreground">
                      Subject :{" "}
                    </span>
                    {item.category?.subject}
                  </li>
                )}
                {item.category?.part && (
                  <li>
                    <span className="font-medium text-foreground">Part :</span>
                    {item.category?.part}
                  </li>
                )}
              </ul>
            </div>

            {/* Published & Updated */}
            <ul className="space-y-2">
              <li>
                <strong className="text-foreground">Published:</strong>{" "}
                <span className="text-muted-foreground">
                  {formatDate(item?.createdAt)}
                </span>
              </li>
              {item.updatedAt && (
                <li>
                  <strong className="text-foreground">Last Updated:</strong>{" "}
                  <span className="text-muted-foreground">
                    {formatDate(item?.updatedAt)}
                  </span>
                </li>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <li>
                  <strong className="text-foreground">Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </TabsContent>

          {/* description & Outcomes Tab */}
          <TabsContent
            value="description"
            className="md:w-5/6 lg:w-4/5 space-y-3"
          >
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">
              {item.description || "No description available for this item."}
            </p>
            {item.outComes?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Learning Outcomes</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {item.outComes.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* chapters Tab */}
          {series && item.chapters?.length > 0 && (
            <TabsContent
              value="curriculum"
              className="md:w-1/3 space-y-2 text-sm"
            >
              <h2 className="text-lg font-semibold mb-2">Curriculum</h2>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                {item.chapters.map((ch, i) => (
                  <li key={i}>{ch.title}</li>
                ))}
              </ul>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </SectionWrapper>
  );
};

export default ItemDetails;
