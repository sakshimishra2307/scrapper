const paginationFilter = (pageSize, pageNumber, reviews) => {
  return reviews.slice((pageNumber - 1) * pageSize, pageSize * pageNumber);
};

module.exports = {
  paginationFilter,
};
