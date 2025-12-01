// components/BlogCard.jsx
"use client";

import ImageGalleryModal from "@/components/ImageGalleryModal";
import { Dialog } from "@/components/ui/dialog";
import { format } from "date-fns";
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BlogCard = ({ blog }) => {
  const {
    _id,
    title,
    slug,
    shortDescription,
    content = [],
    images = [],
    likes,
    comments,
    educator,
    createdAt,
  } = blog;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;

    // If scrollHeight (actual content) > clientHeight (visible)
    if (element.scrollHeight > element.clientHeight + 10) {
      setShouldShowToggle(true);
    }
  }, [content]);

  // Data Calculations
  const likeCount = likes?.length || 0;
  const commentCount = comments?.length || 0;

  const educatorName = educator.firstName
    ? `${educator?.firstName} ${educator?.lastName}`
    : educator?.name;
  const educatorImage = educator?.image || "/default-avatar.jpg";

  // open gallery modal
  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  // Format images for the modal component (requires { url: string } structure)
  const formattedImages = images?.map((url) => ({ url })) || [];

  return (
    <>
      {/* Card Container:  Social Feed Style */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg mb-6 w-full  mx-auto transition-all duration-300 hover:shadow-2xl">
        {/* Header: Educator Info & Time */}
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className="flex items-center">
            <Link href={`/educators/${educator?.userName}`}>
              <Image
                src={educatorImage}
                alt={educatorName}
                width={40}
                height={40}
                className="rounded-full object-cover mr-3 border-2 border-indigo-500"
              />
            </Link>
            <div>
              <Link
                href={`/educators/${educator?.userName}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {educatorName}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {createdAt
                  ? format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")
                  : "Date Unavailable"}
              </p>
            </div>
          </div>
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Blog Content: Title & Short Description + Main Content */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            {title}
          </h2>

          {/* Short Description */}
          {shortDescription && (
            <p className="text-gray-700 dark:text-gray-300 mb-2 italic text-sm">
              {shortDescription}
            </p>
          )}

          {/* Full Content Area */}
          <div className="mb-2">
            <div
              ref={contentRef}
              className={`
          prose prose-sm dark:prose-invert text-gray-900 dark:text-gray-100
          transition-all duration-300
          ${expanded ? "" : "line-clamp-3"}
        `}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {shouldShowToggle && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-indigo-600 dark:text-indigo-400 mt-2 text-sm font-medium hover:underline"
              >
                {expanded ? "See Less" : "See More"}
              </button>
            )}
          </div>
        </div>

        {/* Image Gallery (2-Image Logic) */}
        {images && images.length > 0 && (
          <div
            className={`
            ${images.length === 1 ? "h-96" : "grid grid-cols-2 gap-1"} 
            w-full bg-gray-100 dark:bg-gray-900 cursor-pointer
          `}
          >
            {images.slice(0, 2).map((imgSrc, index) => (
              <div
                key={index}
                className={`${images.length === 1 ? "col-span-2 h-full" : "col-span-1 h-60"} relative`}
                onClick={() => openGallery(index)} // Image click to open Modal
              >
                <Image
                  src={imgSrc}
                  alt={`${title} image ${index + 1}`}
                  fill
                  className="object-cover hover:opacity-90 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay for +X more images */}
                {images.length > 2 && index === 1 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold hover:bg-opacity-60 transition"
                    onClick={() => openGallery(2)} // Image click to open Modal
                  >
                    +{images.length - 2} more
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats: Likes, Comments, Views */}
        <div className="p-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ThumbsUp size={16} className="text-indigo-500 fill-indigo-500" />
            <span>{likeCount} Likes</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{commentCount} Comments</span>
            </div>
          </div>
        </div>

        {/* Interaction Bar: Like, Comment, Share */}
        <div className="flex divide-x divide-gray-200 dark:divide-gray-700 text-gray-600 dark:text-gray-300">
          {/* Like Button */}
          <button className="flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-bl-lg transition">
            <ThumbsUp size={20} />
            <span className="font-medium">Like</span>
          </button>
          {/* Comment Button */}
          <button className="flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <MessageSquare size={20} />
            <span className="font-medium">Comment</span>
          </button>
          {/* Share Button */}
          <button className="flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-br-lg transition">
            <Share2 size={20} />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>

      {/*Image Gallery MODAL*/}
      {formattedImages.length > 0 && (
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <ImageGalleryModal
            images={formattedImages}
            index={currentIndex}
            onClose={() => setGalleryOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
};

export default BlogCard;
