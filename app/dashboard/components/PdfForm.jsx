"use client";

import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy load for react-pdf
const PdfViewer = dynamic(
  () => import("@/app/(main)/books/[id]/read/components/PDFViewer"),
  {
    ssr: false,
  }
);

const PdfForm = ({ title, fileUrl }) => {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div className="space-y-3 p-3">
      <Label className="block text-sm font-semibold mb-2">PDF File</Label>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 truncate">
            {title || "No PDF uploaded"}
          </span>
          <button
            onClick={() => setShowPdf(!showPdf)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showPdf ? "Hide PDF" : "View PDF"}
          </button>
        </div>
      </div>

      {showPdf && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <PdfViewer fileUrl={fileUrl} />
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        To change the PDF file, please contact support.
      </p>
    </div>
  );
};

export default PdfForm;
