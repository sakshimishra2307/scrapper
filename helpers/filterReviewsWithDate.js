"use strict";

/**
 * Filter reviews till a perticulr date
 * @param {object} reviews array containing reviews
 * @param {date} filterDate filter date for reviews
 */

const filterReviews = (reviews, filterDate) => {
  return reviews.filter((elem) => {
    if (new Date(elem.review_date) > new Date(filterDate)) {
      return elem;
    }
  });
};

/**
 * Sort reviews from recent to old
 * @param {object} reviews array containing reviews
 */

const sortReviews = (reviews) => {
  return reviews.sort((review1, review2) => {
    if (new Date(review1.review_date) > new Date(review2.review_date)) {
      return -1;
    }
    if (new Date(review1.review_date) < new Date(review2.review_date)) {
      return 1;
    }
    return 0;
  });
};

module.exports = { filterReviews, sortReviews };
