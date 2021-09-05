// This file will contain tests to test our routes endpoints

const supertest = require("supertest");
const request = require("supertest");
const app = require("../../app");

describe("Test Get /launches", () => {
    test("it should respond with 200 sucess", async () => {
        // actual test goes here
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);
        // expect(response.statusCode).toBe(200);
    });
});

describe("Test Post /launch", () => {
    const completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
        launchDate: "zoot",
    };

    test("it should respond with 201 sucess", async () => {
        const response = await request(app)
            .post("/launches")
            .send(completeLaunchData)
            .expect("Content-Type", /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);

        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
        const response = await supertest(app)
            .post("/launches")
            .send(launchDataWithoutDate)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Missing Required launch property",
        });
    });

    test("It should catch missing invalid Dates", async () => {
        const response = await supertest(app)
            .post("/launches")
            .send(launchDataWithInvalidDate)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Invalid Launch Date property",
        });
    });
});
