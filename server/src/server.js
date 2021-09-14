const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planetsModel");

const port = 8000;
const MONGO_URL =
    "mongodb+srv://mo2a:password@cluster0.n2peb.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.on("open", () => {
    console.log("Connected Sucessfully to Database");
});
mongoose.connection.on("error", (err) => {
    console.log("Failed To Connect To Database with error : " + err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        // all these are options in the mongoDb driver that mongoose uses to connect to database
        useNewUrlParser: true,
        useFindAndModify: false, // Disble the outdated way of updating mongo data
        useCreateIndex: true,
        useUnifiedTopology: true, // MOngo will use the updated way to talk to the clusters
    });

    await loadPlanetsData();
    server.listen(port, () => {
        console.log("Start Listening to requests at port " + port);
    });
}
startServer();
/* This is a good way because of our ability to separte server functionality from our express code */
