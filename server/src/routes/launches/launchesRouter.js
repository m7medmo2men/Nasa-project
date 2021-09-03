const { httpGetAllLaunches, httpAddNewLaunches } = require("./launchesController");
const express = require("express");
const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunches);

module.exports = launchesRouter;
