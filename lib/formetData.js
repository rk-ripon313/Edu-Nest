export function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

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
