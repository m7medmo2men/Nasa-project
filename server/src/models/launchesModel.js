const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });

    if (response.status !== 200) {
        console.log("Problem Downloading Launches Data");
        throw new Error("Launch Data Downloading Failed");
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"];
        const customers = payloads.flatMap((payload) => {
            return payload["customers"];
        });

        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers,
        };

        console.log(launch.flightNumber, launch.mission);
        saveLaunch(launch);
    }
}

async function loadLaunchesData() {
    console.log("Downloading Launches Data ...");
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });

    if (firstLaunch) {
        console.log("Launches data already loaded");
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
    const latestFlightNumber = await launches.findOne().sort("-flightNumber");
    if (!latestFlightNumber) return 1;

    return latestFlightNumber.flightNumber;
}

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
    return await launches
        .find({}, { _id: 0, __v: 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target });
    if (!planet) {
        throw new Error("No matching planet found");
    }
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
    loadLaunchesData,
};
