"use strict";

const puppeteer = require("puppeteer");
const utils = require("./utils");
const filterHelper = require("../../helpers/filterReviewsWithDate");

/**
 * Yelp scrapper
 * @param {object} pageDetails http request parameters
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

const scrapeYelp = async (pageDetails, res, next) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page
      .goto(pageDetails.url, { waitUntil: "domcontentloaded" })
      .catch((err) => {
        console.log(`Error while goto: ${err}`);
      });
    let reviews = await fetchData(page, 0);
    let allReviews = await utils.processingReviews(reviews);
    await browser.close();
    console.log("page closed..");
    let result = allReviews.map(({ user, comment, localizedDate, rating }) => {
      return {
        rating: rating,
        review_date: localizedDate,
        reviewer_name: user.markupDisplayName,
        comment: comment?.text,
      };
    });
    result = filterHelper.sortReviews(result);
    let filteredResult;
    if (pageDetails.filter_date) {
      filteredResult = filterHelper.filterReviews(
        result,
        pageDetails.filter_date
      );
    }
    return {
      review_count: pageDetails.filter_date
        ? filteredResult.length
        : result.length,
      aggregated_reviews: pageDetails.filter_date ? filteredResult : result,
    };
  } catch (err) {
    next(err);
  }
};

/**
 * fetching reviews
 * @param {page} page page with reviews
 * @param {string} url url for fetch call
 */

const fetchData = async (page, pageCount) => {
  return page.evaluate(
    async (pCount, payload, url) => {
      let res = await fetch(`${url}=${pCount}`, payload);
      return res.json();
    },
    pageCount,
    utils.payload,
    utils.urls.YelpFetchUrl
  );
};

module.exports = scrapeYelp;
