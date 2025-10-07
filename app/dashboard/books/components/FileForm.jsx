"use client";

import { updateABook } from "@/app/actions/boook.action";
import { Button } from "@/components/ui/button";
import { uploadFileToCloudinary } from "@/lib/upload";
import imageCompression from "browser-image-compression";
import { ImageIcon, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Lazy load for react-pdf
const PdfViewer = dynamic(
  () => import("@/app/(main)/books/[id]/read/components/PDFViewer"),
  {
    ssr: false,
  }
);

const FileForm = ({ book }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(book?.thumbnail);
  const [loading, setLoading] = useState(false);

  const [showPdf, setShowPdf] = useState(false);

  const toggleEdit = () => {
    if (isEditing) {
      setThumbnail(null);
      setThumbnailPreview(book?.thumbnail);
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
            maxSizeMB: 1,
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

  const handleSave = async () => {
    if (!thumbnail) {
      toast.error("No changes to save");
      return;
    }

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

      const result = await updateABook(book?.id, { thumbnail: thumbnailUrl });

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
    <div className="mt-6 p-4 bg-white dark:bg-slate-950 rounded-lg shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button variant="ghost" onClick={toggleEdit} className="border">
          <Pencil className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit File"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium  mb-2">Thumbnail</label>
          {!isEditing ? (
            <img
              src={thumbnailPreview}
              alt="Thumbnail"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <>
              <div
                {...getThumbProps()}
                className="border-2 border-green-500 border-dashed rounded-lg p-2 text-center h-48 flex items-center justify-center
                 w-full bg-green-50 dark:bg-blue-950 hover:bg-green-100 dark:hover:bg-blue-900 transition cursor-pointer"
              >
                <input {...getThumbInputProps()} />
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-center my-1 text-gray-700 dark:text-gray-300">
                Drag & drop or click for Change Thumbnail
              </p>
            </>
          )}
        </div>

        {/* PDF File Section  (read-only) */}

        <div>
          <label className="block text-sm font-medium mb-2">PDF File</label>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate">
                {book.title || "No PDF uploaded"}
              </span>
              <button
                disabled={isEditing}
                onClick={() => setShowPdf(!showPdf)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showPdf && !isEditing ? "Hide PDF" : "View PDF"}
              </button>
            </div>
          </div>

          {showPdf && !isEditing && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <PdfViewer fileUrl={book?.fileUrl} />
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            To change the PDF file, please contact support.
          </p>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex  items-center gap-x-2 mt-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileForm;
