const app = require("../bin/www");
const mongoose = require("mongoose");
const userModel = require("../models/usersModel");

const request = require("supertest");

beforeAll(async () => {
    await userModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    app.close();
});

describe("This set of code is going to test register and login for both admins and users", () => {
    test("Register a user", async () => {
        const response = await request(app)
        .post("/v1/auth/register")
        .send({
            fullName: "Victor Ukok",
            email: "mfreke.victor@gmail.com",
            password: "victorukok"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Created");

    });

    test("Register an admin", async () => {
        const response = await request(app)
        .post("/v1/auth/register")
        .send({
            fullName: "AdminVictor Ukok",
            email: "admin.victor@gmail.com",
            password: "victorukok"
        });

        await userModel.findOneAndUpdate({email: "admin.victor@gmail.com"}, {
            role: "admin"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Created");

    });

    test("Login a user", async () => {
        const response = await request(app)
        .post("/v1/auth/login")
        .send({
            email: "mfreke.victor@gmail.com",
            password: "victorukok"
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.userDetails).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        expect(response.body.userDetails.role).toBe("user");

    });

    test("Login an admin", async () => {
        const response = await request(app)
        .post("/v1/auth/login")
        .send({
            email: "admin.victor@gmail.com",
            password: "victorukok"
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
        expect(response.body.userDetails).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        expect(response.body.userDetails.role).toBe("admin");

    });
});

