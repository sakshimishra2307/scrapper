"use strict";

const puppeteer = require("puppeteer");
const utils = require("./utils");
const filterHelper = require("../../helpers/filterReviewsWithDate");
const paginationFilter = require("../../helpers/pagination");

/**
 * Glassdoor scrapper
 * @param {object} req http request parameters
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

const scrapeGlassdoor = async (req, res, next) => {
  try {
    console.log("processing for glassdoor data..");
    const browser = await puppeteer.launch({ headless: false });
    let newPage = await browser.newPage();
    let re = await fetchReviews(newPage, req.url);
    console.log("reviews fetched..");
    await browser.close();
    console.log("page closed..");
    let result = re[0].data.employerReviews.reviews.map(
      ({ __typename, summary, reviewDateTime, ratingOverall }) => {
        return {
          rating: ratingOverall,
          review_date: reviewDateTime,
          reviewer_name: `Anonymous ${__typename}`,
          comment: summary,
        };
      }
    );
    let pageSize = req.page_size || result.length;
    let pageNum = req.page_no || 1;
    result = filterHelper.sortReviews(result);
    if (req.filter_date) {
      result = filterHelper.filterReviews(result, req.filter_date);
    }
    if ((pageNum - 1) * pageSize > result.length) {
      return res.status(400).send({
        message: "please provide valid page number and page size",
      });
    }

    result = paginationFilter.paginationFilter(pageSize, pageNum, result);
    return {
      review_count: result.length,
      aggregated_reviews: result,
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
