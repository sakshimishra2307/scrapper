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
    console.log("processing for yelp data..");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page
      .goto(pageDetails.url, { waitUntil: "domcontentloaded" })
      .catch((err) => {
        console.log(`error while goto: ${err}`);
      });
    let reviews = await utils.fetchData(page, 0);
    let allReviews = await utils.processingReviews(page, reviews);
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

module.exports = scrapeYelp;
