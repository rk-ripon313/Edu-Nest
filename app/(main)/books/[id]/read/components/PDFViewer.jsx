"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.8);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goPrev = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goNext = () => setPageNumber((p) => Math.min(p + 1, numPages));

  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 1.6));
  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5));
  const resetZoom = () => setScale(0.8);

  const handlePageInput = (e) => {
    let val = Number(e.target.value);
    if (val >= 1 && val <= numPages) setPageNumber(val);
  };

  return (
    <div className="flex flex-col items-center w-full p-2 ">
      {/* Controls on Top */}
      <div
        className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sticky top-0
       bg-white dark:bg-gray-800 p-2 z-10 shadow rounded-md"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-900  rounded disabled:opacity-50"
          >
            Prev
          </button>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInput}
            min={1}
            max={numPages || 1}
            className="w-16 text-center border rounded px-2 py-1"
          />
          <span>/ {numPages || "?"}</span>
          <button
            onClick={goNext}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-900 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="px-3 py-1 bg-gray-200 dark:bg-slate-900 rounded"
          >
            -
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-3 py-1 bg-gray-200 dark:bg-slate-900 rounded"
          >
            +
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-1 bg-red-200 rounded text-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div
        className="flex justify-center items-start border rounded shadow overflow-auto w-full max-w-[900px] min-w-[300px]
           bg-white dark:bg-gray-800 p-2"
        style={{
          height: "calc(100vh - 140px)",
        }}
      >
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="flex justify-center w-full">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="h-auto"
              style={{ display: "block" }}
            />
          </div>
        </Document>
      </div>
    </div>
  );
};
export default PdfViewer;
