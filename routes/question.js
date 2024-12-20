const express = require("express");
const questionController = require("../controllers/questions");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const { body } = require("express-validator");
const router = express.Router();

// GET all questions with filtering
router.get("/questions", isAuth, questionController.getQuestions);

// GET question by ID
router.get("/questions/:questionId", isAuth, questionController.getQuestion);

// GET questions by exam ID
router.get("/questions/:examId/exam", isAuth, questionController.getQuestionsByExam);

// POST create new question
router.post(
  "/questions",
  isAuth,
  isAdmin,
  [
    body("title").trim().notEmpty().withMessage("Question title is required"),
    body("examId").trim().notEmpty().withMessage("Exam ID is required"),
    body("options").isArray({ min: 1 }).withMessage("At least one option is required"),
    body("correctAnswer").trim().notEmpty().withMessage("Correct answer is required"),
    body("marks").isInt({ min: 0 }).withMessage("Marks must be a positive number"),
  ],
  questionController.postQuestion
);

// PUT update question
router.put(
  "/questions/:questionId",
  isAuth,
  isAdmin,
  [
    body("title").trim().notEmpty().withMessage("Question title is required"),
    body("options").isArray({ min: 1 }).withMessage("At least one option is required"),
    body("correctAnswer").trim().notEmpty().withMessage("Correct answer is required"),
    body("marks").isInt({ min: 0 }).withMessage("Marks must be a positive number"),
  ],
  questionController.updateQuestion
);

// DELETE question
router.delete("/questions/:questionId", isAuth, isAdmin, questionController.deleteQuestion);

module.exports = router; 