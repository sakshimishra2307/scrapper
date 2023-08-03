"use strict";

const puppeteer = require("puppeteer");
const utils = require("./utils");
const filterHelper = require("../../helpers/filterReviewsWithDate");
const paginationFilter = require("../../helpers/pagination");

/**
 * Yelp scrapper
 * @param {object} req http request parameters
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

const scrapeYelp = async (req, res, next) => {
  try {
    console.log("processing for yelp data..");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.url, { waitUntil: "domcontentloaded" }).catch((err) => {
      console.log(`error while goto: ${err}`);
    });
    let reviews = await utils.fetchData(page, 0);
    let allReviews = await utils.processingReviews(page, reviews);
    let pageSize = req.page_size || allReviews.length;
    let pageNum = req.page_no || 1;
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

module.exports = scrapeYelp;
