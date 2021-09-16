const { deleteOne } = require("./launches.mongo");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

// const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
};

// launches.set(launch.flightNumber, launch);

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await launches.find({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
    const latestFlightNumber = await launches.findOne().sort("-flightNumber");
    if (!latestFlightNumber) return 1;

    return latestFlightNumber.flightNumber;
}

async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launches.find({}, { _id: 0, __v: 0 });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        sucess: true,
        upcoming: true,
        customers: ["Zero To Mastery", "NASA"],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             sucess: true,
//             upcoming: true,
//             customers: ["Zero To Mastery", "NASA"],
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

async function saveLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target });
    if (!planet) {
        throw new Error("No matching planet found");
    }
    await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
        upsert: true,
    });
}

async function abortLaunchById(launchId) {
    const aborted = await launches.updateOne(
        {
            flightNumber: launchId,
        },
        {
            upcoming: false,
            success: false,
        }
    );
    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
};
