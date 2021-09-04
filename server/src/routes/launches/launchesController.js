const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require("./../../models/launchesModel");

function httpGetAllLaunches(req, res) {
    res.status(200).json(getAllLaunches());
}
function httpAddNewLaunches(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing Required launch property",
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid Launch Date property",
        });
    }
    addNewLaunch(launch);
    res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: "launch not found",
        });
    }

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch,
};
