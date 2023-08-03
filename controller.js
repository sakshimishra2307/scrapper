"use strict";

const scrapeYelp = require("./handlers/yelp/index");
const scrapeGlassdoor = require("./handlers/glassdoor/index");

/**
 * Application route controller
 * @param {object} req http request
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

module.exports = async (req, res, next) => {
  try {
    if (!req.body.source_name || !req.body.url) {
      return res.status(400).send({
        message:
          "please provide the missing parameters from source_name and url",
      });
    }
    let result;
    switch (req.body.source_name) {
      case "yelp":
        result = await scrapeYelp(req.body, res, next);
        res.send(result);
        break;
      case "glassdoor":
        result = await scrapeGlassdoor(req.body, res, next);
        res.send(result);
        break;
      default:
        res.status(400).send({
          message: "provided source_name is not supported",
        });
    }
  } catch (err) {
    throw err;
  }
};
