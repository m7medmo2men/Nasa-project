const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planetsModel");

const port = 8000;
const server = http.createServer(app);

async function startServer() {
    await loadPlanetsData();
    server.listen(port, () => {
        console.log("Start Listening to requests at port " + port);
    });
}
startServer();
/* This is a good way because of our ability to separte server functionality from our express code */
