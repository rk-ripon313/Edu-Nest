/**
 * Apply sort to an array of enriched items based on a sort key
 * @param {Array} items - Array of items (e.g., books, courses)
 * @param {string} sort - Sort type: 'rating', 'enrollment', 'price-low', 'price-high', 'latest', 'oldest'
 * @returns {Array} - Sorted array
 */
export const applySort = (items, sort) => {
  const sorted = [...items]; // avoid mutating original array

  switch (sort) {
    case "rating":
      sorted.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case "enrollment":
      sorted.sort((a, b) => b.totalEnrollments - a.totalEnrollments);
      break;
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "latest":
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "oldest":
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      break;
  }

  return sorted;
};

//  MongoDB sort stage
export const getMongoSortStage = (sortKey) => {
  const sortOptions = {
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  return sortOptions[sortKey] || { createdAt: -1 };
};
