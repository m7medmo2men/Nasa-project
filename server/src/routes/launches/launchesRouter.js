const { httpGetAllLaunches } = require("./launchesController");
const express = require("express");
const launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

module.exports = launchesRouter;
