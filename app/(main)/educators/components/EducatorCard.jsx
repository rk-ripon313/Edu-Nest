import { Button } from "@/components/ui/button";
import { Award, BookOpen, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EducatorCard = ({ educator }) => {
  const {
    name,
    userName,
    image,
    totalBooks,
    totalSeries,
    totalEnrolls,
    totalRated,
    avgRating,
    totalFollowers,
  } = educator;
  return (
    <Link href={`/educators/${userName}`}>
      <div className="group bg-light_bg dark:bg-dark_bg rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-4 cursor-pointer">
        {/* Header Row */}
        <div className="flex items-center gap-3">
          {/* Image */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
            <Image
              src={image || "/default-avatar.png"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          {/* Name + Username + Followers */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              {name}
            </h3>
            <p className="text-sm text-gray-500">@{userName}</p>

            {/* Followers */}
            <p className="text-xs mt-1 flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Users className="w-3 h-3 text-blue-500" />
              {totalFollowers} followers
            </p>
          </div>
        </div>

        {/* Rating + Enrolls */}
        <div className="flex justify-between items-center mt-4 px-1">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium text-gray-900 dark:text-white">
              {avgRating}
            </span>
            <span className="text-gray-400 text-sm">({totalRated})</span>
          </div>

          {/* Enrolls */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span className="font-medium">{totalEnrolls}</span>
            <span className="text-sm text-gray-400">enrolled</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 dark:bg-slate-700 my-4" />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto" />
            <span className="text-xs text-gray-500">Books</span>
            <p className="text-sm font-semibold">{totalBooks}</p>
          </div>

          <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto" />
            <span className="text-xs text-gray-500">Series</span>
            <p className="text-sm font-semibold">{totalSeries}</p>
          </div>

          <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
            <Users className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
            <span className="text-xs text-gray-500">Enrolls</span>
            <p className="text-sm font-semibold ">{totalEnrolls}</p>
          </div>
        </div>

        {/* Button */}
        <Button className="mt-4 w-full text-sm  text-white rounded-lg transition">
          View Profile
        </Button>
      </div>
    </Link>
  );
};
export default EducatorCard;
// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { BookOpen, Layers, Star, Users } from "lucide-react";
// import Link from "next/link";

// const EducatorCard = ({ educator }) => {
//   return (
//     <div
//       className=" block bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md
//                  hover:border-primary/40 transition-all duration-300"
//     >
//       {/* Top: Avatar + Name */}
//       <div className="flex items-center gap-4">
//         <Link href={`/educators/${educator.userName}`}>
//           <Avatar className="w-14 h-14 border">
//             <AvatarImage src={educator.image} />
//             <AvatarFallback>{educator.name?.charAt(0)}</AvatarFallback>
//           </Avatar>
//         </Link>

//         <div>
//           <h3 className="font-semibold text-lg group-hover:text-primary transition">
//             {educator.name}
//           </h3>
//           <p className="text-sm text-muted-foreground">{educator.bio}</p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
//         <div className="flex items-center gap-2">
//           <Star className="w-4 h-4 text-yellow-500" />
//           <span>{educator.avgRating} Avg Rating</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <Users className="w-4 h-4 text-primary" />
//           <span>{educator.totalEnrolls} Enrolls</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <BookOpen className="w-4 h-4 text-blue-500" />
//           <span>{educator.totalBooks} Books</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <Layers className="w-4 h-4 text-purple-500" />
//           <span>{educator.totalSeries} Series</span>
//         </div>
//       </div>

//       {/* View button */}
//       <Link className="mt-4" href={`/educators/${educator.userName}`}>
//         <span className="text-sm font-medium text-primary hover:underline">
//           View Profile →
//         </span>
//       </Link>
//     </div>
//   );
// };
// export default EducatorCard;
