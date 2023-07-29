"use strict";

const urls = {
  YelpFetchUrl:
    "https://www.yelp.com/biz/Lr-KJ-ZGRp8CmwtyjC2VNw/review_feed?rl=en&q=&sort_by=relevance_desc&start",
};

const payload = {
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=utf-8",
    "sec-ch-ua":
      '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-by-react": "true",
    "x-requested-with": "XMLHttpRequest",
  },
  referrer: "https://www.yelp.com/biz/mathis-home-tulsa?start=10",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
  mode: "cors",
  credentials: "include",
};

const processingReviews = async (reviews) => {
  console.log("reviews fetched..");
  let allReviewsData = [];
  allReviewsData.push(reviews.reviews);
  let fetchDataCount = Math.ceil(
    reviews.pagination.totalResults / reviews.pagination.resultsPerPage
  );
  let fetchAllReviewsPromises = [];
  for (let i = 1; i < fetchDataCount; i++) {
    fetchAllReviewsPromises.push(fetchData(page, i * 10));
  }
  let data = await Promise.all(fetchAllReviewsPromises);

  for (let i = 0; i < data.length; i++) {
    allReviewsData.push(data[i].reviews);
  }
  return allReviewsData.flat();
};

module.exports = {
  urls,
  payload,
  processingReviews,
};
