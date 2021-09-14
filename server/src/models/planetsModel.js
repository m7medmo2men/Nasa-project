const parse = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

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
            .on("data", async (data) => {
                if (isHabitablePlanet(data)) {
                    // hapitablePlanets.push(data) ;
                    await savePlanet(data);
                }
            })
            .on("error", (err) => {
                console.log("Error Happend : " + err);
                reject(err);
            })
            .on("end", async () => {
                const planetsCount = (await getAllPlanets()).length;
                console.log("Finish Reading File");
                console.log(`Find ${planetsCount} planets`);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find({});
}

async function savePlanet(planet) {
    // We can't use create because this function is called alot

    // await planets.create({
    //     keplerName: data.kepler_name,
    // });

    // so we will use upsert which is inset + update;

    try {
        await planets.updateOne(
            { keplerName: planet.kepler_name },
            { keplerName: planet.kepler_name },
            { upsert: true }
        );
    } catch (err) {
        console.log(`Could not save the planet  ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};
