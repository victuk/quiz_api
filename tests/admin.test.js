const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const quizModel = require("../models/quizModel");

let adminToken = "";

let quizId = "";

beforeAll(async () => {
    await quizModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    app.close();
});

describe("Testing admin routes", () => {

    test("Login the admin", async () => {

        const response = await request(app)
            .post("/v1/auth/login")
            .send({
                email: "admin.victor@gmail.com",
                password: "victorukok"
            });

            adminToken = response.body.token;

            expect(response.status).toBe(200);

    });
    
    test("Add a quiz", async () => {
        const response = await request(app)
        .post("/v1/admin/quiz")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            questionNumber: "1",
            question: "A baby lion is called?",
            optionA: "Cob",
            optionB: "Baby lion",
            optionC: "Lioness",
            optionD: "Lion baby",
            correctOption: "optionA"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Quiz created");

    });

    test("Add a second quiz", async () => {
        const response = await request(app)
        .post("/v1/admin/quiz")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            questionNumber: "2",
            question: "The full meaning of W.H.O is __________?",
            optionA: "World Happy Organization",
            optionB: "World Health Organization",
            optionC: "Wound, Health and Organism",
            optionD: "Wall Handle and Opacity",
            correctOption: "optionB"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Quiz created");

    });

    test("Get a list of quiz", async () => {
        const response = await request(app)
        .get("/v1/admin/quiz/1/10")
        .set("Authorization", `Bearer ${adminToken}`);

        quizId = response.body.quizList.docs[0]._id;

        expect(response.status).toBe(200);
        expect(typeof(response.body.quizList)).toBe("object");

    });


    test("Get quiz by Id", async () => {
        const response = await request(app)
        .get("/v1/admin/quiz-by-id/" + quizId)
        .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.quiz.question).toBe("A baby lion is called?");

    });
});