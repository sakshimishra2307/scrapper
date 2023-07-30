"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const controller = require("./controller");
const errorHandler = require("./helpers/errorHandler");

app.get("/healthCheck", (req, res) => {
  res.send("server up and running");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/aggregate", controller);

app.use(errorHandler);

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`app is listening on port ${port}`);
});
