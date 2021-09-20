const http = require("http");

require("dotenv").config(); // This Line is called here because we want to populate values which is in  .env file also inside the files down

const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planetsModel");
const { loadLaunchesData } = require("./models/launchesModel");

const port = 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(port, () => {
        console.log("Start Listening to requests at port " + port);
    });
}

startServer();
/* This is a good way because of our ability to separte server functionality from our express code */
