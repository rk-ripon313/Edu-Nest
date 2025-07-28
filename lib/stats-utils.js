export const getRatingLabel = (avg) => {
  if (avg >= 4.5) return "Excellent";
  if (avg >= 4) return "Very Good";
  if (avg >= 3) return "Good";
  if (avg >= 2) return "Fair";
  return "Poor";
};
