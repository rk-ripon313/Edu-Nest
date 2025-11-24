"use client";

import { DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const ImageGalleryModal = ({
  images = [],
  index = 0,
  onClose,
  onDelete,
  setImages,
  isEditMode = false,
}) => {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    setCurrent(index);
  }, [index]);

  const currentImage = images[current];

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleDelete = () => {
    if (!isEditMode) return;

    onDelete(current);

    if (images.length <= 1) {
      onClose();
    } else if (current >= images.length - 1) {
      setCurrent(0);
    }
  };

  if (!currentImage) return null;

  return (
    <DialogContent className="max-w-3xl p-0 bg-background border-border">
      <div className="relative w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 
                 p-3 bg-black/40 rounded-full backdrop-blur transition"
        >
          <X size={26} />
        </button>

        {/* Delete Button (Only in Edit Mode) */}
        {isEditMode && (
          <button
            onClick={handleDelete}
            className="absolute top-4 left-4 text-white bg-red-600 hover:bg-red-700
                     p-3 rounded-full z-50 transition"
          >
            <Trash2 size={20} />
          </button>
        )}

        {/* Main Section */}
        <div className="relative flex items-center justify-center select-none">
          {/* Main Image */}
          <img
            src={currentImage.url}
            alt=""
            className="max-h-[90vh] w-auto object-contain"
          />

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 text-white bg-black/40 hover:bg-black/60 
                       p-3 rounded-full transition hidden md:block"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 text-white bg-black/40 hover:bg-black/60 
                       p-3 rounded-full transition hidden md:block"
            >
              <ChevronRight size={30} />
            </button>
          )}

          {/* Counter */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2
                        bg-black/50 text-white px-4 py-2 rounded-full text-sm"
          >
            {current + 1} / {images.length}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
export default ImageGalleryModal;
