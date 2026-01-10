"use client";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import { Dialog } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

const BlogImages = ({ images }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // open gallery modal
  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  // Format images for the modal component (requires { url: string } structure)
  const formattedImages = images?.map((url) => ({ url })) || [];
  return (
    <>
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
              alt={`blog image ${index + 1}`}
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
export default BlogImages;
