const parse = require("csv-parse");
const fs = require("fs");
const path = require("path");

const hapitablePlanets = [];

const isHabitablePlanet = (planet) => {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6
    );
};

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
            .pipe(
                parse({
                    comment: "#",
                    columns: true,
                })
            )
            .on("data", (data) => {
                if (isHabitablePlanet(data)) hapitablePlanets.push(data);
            })
            .on("error", (err) => {
                console.log("Error Happend : " + err);
                reject(err);
            })
            .on("end", () => {
                console.log("Finish Reading File");
                resolve(hapitablePlanets);
            });
    });
}

module.exports = {
    loadPlanetsData,
    planets: hapitablePlanets,
};
