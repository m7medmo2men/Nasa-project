const mongoose = require("mongoose");
const app = require("../app");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("Connected Sucessfully to Database");
});
mongoose.connection.on("error", (err) => {
    console.log("Failed To Connect To Database with error : " + err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        // all these are options in the mongoDb driver that mongoose uses to connect to database
        useNewUrlParser: true,
        useFindAndModify: false, // Disble the outdated way of updating mongo data
        useCreateIndex: true,
        useUnifiedTopology: true, // MOngo will use the updated way to talk to the clusters
    });
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};
