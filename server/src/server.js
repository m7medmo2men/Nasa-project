const http = require("http");
const app = require("./app");

const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log("Start Listening to requests");
});

/* This is a good way because of our ability to separte server functionality from our express code */
