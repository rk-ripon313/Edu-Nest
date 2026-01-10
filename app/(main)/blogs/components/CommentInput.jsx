"use client";

import Spinner from "@/components/ui/Spinner";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CommentInput = ({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  defaultValue = "",
  mode = "create", // "create" | "edit" | "reply"
  enableEnterSubmit = true,
  maxLength = 300,
}) => {
  const [content, setContent] = useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentAreaRef = useRef(null);

  // AUTO EXPAND
  useEffect(() => {
    const el = contentAreaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [content]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const success = await onSubmit(content);

      if (!success) return;

      if (mode === "create" || mode === "reply") {
        setContent("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = mode === "edit";

  return (
    <>
      <div className="relative w-full flex gap-3 items-start my-1">
        <textarea
          ref={contentAreaRef}
          rows={1}
          maxLength={maxLength}
          value={content}
          placeholder={placeholder}
          disabled={isSubmitting}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (enableEnterSubmit && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className={`
          w-full py-2 px-4 pr-12
          bg-gray-100 dark:bg-gray-800 
          border border-gray-300 dark:border-gray-700
          text-sm text-gray-900 dark:text-gray-200
          resize-none overflow-hidden
          focus:outline-none focus:ring-1 focus:ring-indigo-500
          transition-all duration-150
          ${isEditMode ? "rounded-xl" : "rounded-2xl"}
        `}
        />

        {/* --- BUTTONS AREA --- */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 items-center">
          <button
            disabled={isSubmitting || !content.trim()}
            onClick={handleSubmit}
            className="
              text-indigo-600 dark:text-indigo-400
              hover:text-indigo-700 dark:hover:text-indigo-300
              disabled:opacity-40 disabled:cursor-not-allowed 
              transition-all
            "
          >
            {isSubmitting ? <Spinner size={14} /> : <SendHorizonal size={18} />}
          </button>
        </div>
      </div>
      {/* --- CANCEL BUTTON FOR EDIT MODE --- */}
      {isEditMode && (
        <button
          disabled={isSubmitting}
          onClick={onCancel}
          className="text-sm ms-1 text-blue-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      )}
    </>
  );
};

export default CommentInput;
