"use client";
import { useEffect, useRef, useState } from "react";

const BlogContent = ({ title, shortDescription, content }) => {
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

  return (
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
  );
};
export default BlogContent;
