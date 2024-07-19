var express = require('express');
const quizModel = require('../models/quizModel');
const verifyAuth = require('../middleware/verifyAuth');
const rolesAllowed = require('../middleware/roleBasedAuth');
var router = express.Router();

router.use(verifyAuth);

router.use(rolesAllowed(["admin"]));

router.post('/quiz', async function (req, res, next) {

  const { question, questionNumber, optionA, optionB, optionC, optionD, correctOption } = req.body;

  await quizModel.create({ question, questionNumber, optionA, optionB, optionC, optionD, correctOption });

  res.status(201).send({
    message: "Quiz created"
  });
});

router.get("/quiz/:page/:limit", async function (req, res, next) {

  const { page, limit } = req.params;

  const quizList = await quizModel.paginate({}, { page, limit });

  res.status(200).send({
    quizList
  });
});

router.get("/quiz-by-id/:id", async function (req, res, next) {

  const { id } = req.params;

  const quiz = await quizModel.findById(id);

  res.status(200).send({
    quiz
  });
});

router.put("/quiz/:id", async function (req, res, next) {

  try {
    
    const { id } = req.params;
  
    const { question, questionNumber, optionA, optionB, optionC, optionD, correctOption } = req.body;
  
    const updatedQuiz = await quizModel.findByIdAndUpdate(id, { question, questionNumber, optionA, optionB, optionC, optionD, correctOption }, {new: true});
  
    res.send({
      message: "Edit successful",
      updatedQuiz
    });

  } catch (error) {
    next(error);
  }
});

// router.delete("/quiz");

module.exports = router;
