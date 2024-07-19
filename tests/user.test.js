const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const activeQuizModel = require("../models/activeQuizModel");


beforeAll(async () => {
    await activeQuizModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    app.close();
});

let userToken = "";

let questionOneId = "";

let questionTwoId = "";

describe("Tests for user's routes", () => {

    test("Login the User", async () => {

        const response = await request(app)
            .post("/v1/auth/login")
            .send({
                email: "mfreke.victor@gmail.com",
                password: "victorukok"
            });

            userToken = response.body.token;

            console.log(response.body.token);

            expect(response.status).toBe(200);

    });

    test("Get question number 1", async () => {

        const response = await request(app)
            .get("/v1/users/quiz/1")
            .set("Authorization", `Bearer ${userToken}`);

            questionOneId = response.body.quiz._id;

            expect(response.status).toBe(200);
            expect(response.body.quiz.question).toBe("A baby lion is called?");

    });

    test("Answer question 1", async () => {
        const response = await request(app)
            .post("/v1/users/answer-a-question")
            .send({
                quiz: questionOneId,
                optionChosen: "optionA"
            })
            .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Answer recorded");

    });


    test("Get question number 2", async () => {

        const response = await request(app)
            .get("/v1/users/quiz/2")
            .set("Authorization", `Bearer ${userToken}`);

            questionTwoId = response.body.quiz._id;

            expect(response.status).toBe(200);
            expect(response.body.quiz.question).toBe("The full meaning of W.H.O is __________?");

    });

    test("Answer question 2", async () => {
        const response = await request(app)
            .post("/v1/users/answer-a-question")
            .send({
                quiz: questionTwoId,
                optionChosen: "optionB"
            })
            .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Answer recorded");

    });

    test("Mark quiz", async () => {
        const response = await request(app)
            .post("/v1/users/mark-quiz")
            .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.totalMarks).toBe(20);
            expect(response.body.totalAnsweredQuetions).toBe(2);
            expect(response.body.totalCorrectQuestions).toBe(2);
            expect(response.body.totalIncorrectQuestions).toBe(0);

    });
});
