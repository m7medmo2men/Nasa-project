const express = require("express");
const planetsRouter = require("./planets/planetsRouter");
const launchesRouter = require("./launches/launchesRouter");

const v1Router = express.Router();

v1Router.use("/launches", launchesRouter);
v1Router.use("/planets", planetsRouter);

module.exports = v1Router;
