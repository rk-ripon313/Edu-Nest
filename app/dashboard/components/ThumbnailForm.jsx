"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateBook } from "@/app/actions/boook.action";
import { updateStudySeries } from "@/app/actions/studySeries.action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadFileToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const ThumbnailForm = ({ thumbnailUrl, itemId, onModel }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(thumbnailUrl);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => {
    if (isEditing) {
      setThumbnail(null);
      setThumbnailPreview(thumbnailUrl);
    }
    setIsEditing((prev) => !prev);
  };

  // Dropzone for thumbnail
  const { getRootProps: getThumbProps, getInputProps: getThumbInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,

      onDrop: async (acceptedFiles) => {
        if (!acceptedFiles[0]) return;

        try {
          const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(
            acceptedFiles[0],
            options
          );
          setThumbnail(compressedFile);
          setThumbnailPreview(URL.createObjectURL(compressedFile));
        } catch (error) {
          console.error("Image compression error:", error);
        }
      },
    });

  //handle submit button
  const handleSave = async () => {
    if (!thumbnail) return toast.error("Please select an image first.");
    try {
      setLoading(true);

      const thumbnailUrl = await uploadFileToCloudinary(
        thumbnail,
        "image",
        "thumbnail"
      );

      if (!thumbnailUrl) {
        toast.error("Image upload failed");
        return;
      }

      const updateAction =
        onModel === "StudySeries" ? updateStudySeries : updateBook;

      const result = await updateAction(itemId, { thumbnail: thumbnailUrl });

      if (result?.success) {
        toast.success(result.message || "Thumbnail updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update thumbnail");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <Label className="block text-sm font-semibold  mb-2">Thumbnail</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleEdit}
          className="flex items-center gap-2 border"
        >
          <Pencil className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div
        {...(isEditing ? getThumbProps() : {})}
        className={`relative w-full h-52 rounded-xl border ${
          isEditing
            ? "border-dashed border-primary bg-muted/30 hover:bg-muted/50 cursor-pointer"
            : "border-gray-200"
        } overflow-hidden transition-all`}
      >
        {isEditing && <input {...getThumbInputProps()} />}
        {thumbnailPreview ? (
          <Image
            src={thumbnailPreview}
            alt="Thumbnail"
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">Upload Thumbnail</p>
          </div>
        )}
        {isEditing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-white text-sm font-medium">
              Click or drag to replace
            </p>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ThumbnailForm;
