"use client";

import { updateUserField } from "@/app/actions/account/accountActions";
import { uploadFileToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const ProfileImageEditor = ({ image, name }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const { update } = useSession();

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compression options
      const options = {
        maxSizeMB: 1, // Target size (1 MB)
        useWebWorker: true,
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);
      setIsUploading(true);

      const imageUrl = await uploadFileToCloudinary(
        compressedFile,
        "image",
        "Profile"
      );

      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      // Step 2: Save URL to DB via action
      const dbRes = await updateUserField({ image: imageUrl });

      if (dbRes.success) {
        toast.success("Profile image updated!");
        await update({ image: imageUrl });
        router.refresh();
      } else {
        toast.error(dbRes?.message || "Failed to save image to database");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-28 h-28 ">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={isUploading}
      />

      {image && !isUploading ? (
        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={image}
            alt={name || "Profile"}
            fill
            sizes="112px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      ) : isUploading ? (
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 border border-gray-300 animate-pulse">
          Uploading...
        </div>
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold text-gray-700 border border-gray-300">
          {name?.charAt(0).toUpperCase()}
        </div>
      )}

      <div
        className={`absolute -bottom-2 -right-2 bg-white rounded-full border border-gray-300 p-1 cursor-pointer hover:bg-gray-100 ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <Pencil className="w-4 h-4 text-gray-600" />
      </div>
    </div>
  );
};

export default ProfileImageEditor;
