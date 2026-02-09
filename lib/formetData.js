/** * Formats a date string into a more readable format.
 * - Converts the input date string into a Date object.
 * - Uses toLocaleDateString to format the date in "en-GB" locale with options for year, month, and day.
 * @param {string} dateString - The input date string to format.
 * @returns {string} - The formatted date string.
 */

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
};

/** * Formats a duration in seconds into a human-readable string.
 * - If the duration is 1 hour or more, it returns "H:MM:SS".
 * - If the duration is less than 1 hour, it returns "M:SS".
 * @param {number} duration - The duration in seconds.
 * @returns {string} - The formatted duration string.
 */

export const formatDuration = (duration) => {
  if (!duration) return "0:00";

  const hour = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  const sec = Math.floor(duration % 60);

  const paddedMin = String(min).padStart(2, "0");
  const paddedSec = String(sec).padStart(2, "0");

  if (hour > 0) {
    return `${hour}:${paddedMin}:${paddedSec}`;
  }
  return `${min}:${paddedSec}`;
};

export const editYouTubeUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[1].length === 11) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }

  return url;
};

/**  
 * Converts a string into a URL-friendly slug.
 * - Trims whitespace, converts to lowercase, and replaces spaces with hyphens.
 * - Removes special characters except for hyphens.
 * - If the resulting slug is empty, returns "untitled".
 * @param {string} text - The input string to slugify.
 * @returns {string} - The slugified version of the input string.
 
  */

export const slugify = (text) => {
  try {
    if (!text || typeof text !== "string") return "untitled";

    const slug = text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\u0980-\u09FFA-Za-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return slug || "untitled";
  } catch (error) {
    console.error("Slugify failed:", error);
    return "untitled";
  }
};
