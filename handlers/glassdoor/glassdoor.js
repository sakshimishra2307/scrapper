"use strict";

const puppeteer = require("puppeteer");
const utils = require("./utils");
const filterHelper = require("../../helpers/filterReviewsWithDate");

/**
 * Glassdoor scrapper
 * @param {object} pageDetails http request parameters
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

const scrapeGlassdoor = async (pageDetails, res, next) => {
  try {
    console.log("processing for glassdoor data..");
    const browser = await puppeteer.launch({ headless: false });
    let newPage = await browser.newPage();
    let res = await fetchReviews(newPage, pageDetails.url);
    console.log("reviews fetched..");
    await browser.close();
    console.log("page closed..");
    let result = res[0].data.employerReviews.reviews.map(
      ({ __typename, summary, reviewDateTime, ratingOverall }) => {
        return {
          rating: ratingOverall,
          review_date: reviewDateTime,
          reviewer_name: `Anonymous ${__typename}`,
          comment: summary,
        };
      }
    );

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

const fetchReviews = async (page, url) => {
  try {
    let gdCsrfToken;
    await page
      .goto(url, { waitUntil: "domcontentloaded" })
      .catch((err) => console.log("goto failed"));
    await page
      .waitForResponse((r) => r.url().includes("graph"), { timeout: 60000 })
      .then((res) => {
        gdCsrfToken = res.request().headers()["gd-csrf-token"];
      })
      .catch(() => console.log("wait for response failed"));
    return page.evaluate(
      async (url, headers) => {
        let res = await fetch(url, headers);
        return res.json();
      },
      utils.urls.glassdoorFetchUrl,
      utils.getRequestHeaders(gdCsrfToken)
    );
  } catch (err) {
    next(err);
  }
};

module.exports = scrapeGlassdoor;
