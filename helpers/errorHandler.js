"use strict";
/**
 * Application error handler
 * @param {object} err application error
 * @param {object} req http request
 * @param {object} res http response
 * @param {function} next invokes the succeeding middleware/function
 */

const errorHandler = (err, req, res, next) => {
  let enviroment = process.env.NODE_ENV || "development";
  let errObj = {};
  let status = err.status || 500;

  if (res.headersSent) {
    return next(err);
  }

  errObj["stackTrace"] = enviroment === "development" ? err.stack : "Network Issue";
  errObj["status"] = status;
  errObj["details"] = err.details || "Error details not found";
  errObj["message"] = err.message || "Internal server error.";
  res.status(status).json(errObj);
};

module.exports = errorHandler;
