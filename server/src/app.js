// This file contains the expres/app code  seprated from the server
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const planetsRouter = require("./routes/planets/planetsRouter");
const launchesRouter = require("./routes/launches/launchesRouter");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.use(morgan("combined"));
app.use(express.json());
app.use("/launches", launchesRouter);
app.use(planetsRouter);
// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "public"));
//     // in case of serving front end and backend from the same server
//     // the /* because our server is handling routing for api only not for the client side
//     // so we can't navigate unless we add the * after the /
// });
// app.use(express.static(path.join(__dirname, "..", "public")));

module.exports = app;
