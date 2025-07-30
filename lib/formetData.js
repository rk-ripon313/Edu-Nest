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
  if (!duration) return null;

  var hour = Math.floor(duration / 3600);
  var min = Math.floor((duration % 3600) / 60);
  var sec = Math.floor((duration % 3600) % 60);

  const durationString = `${hour}:${min}:${sec}`;

  return durationString;
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
