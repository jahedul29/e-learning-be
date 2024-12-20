const express = require("express");
const examController = require("../controllers/exams");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const { body } = require("express-validator");
const router = express.Router();

// GET all exams with filtering
router.get("/exams", isAuth, examController.getExams);

// GET exam by ID
router.get("/exams/:examId", isAuth, examController.getExam);

// GET exams by course ID
router.get("/exams/:courseId/course", isAuth, examController.getExamsByCourse);

// POST create new exam
router.post(
  "/exams",
  isAuth,
  isAdmin,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("courseId")
      .trim()
      .notEmpty()
      .withMessage("Course ID is required"),
  ],
  examController.postExam
);

// PUT update exam
router.put(
  "/exams/:examId",
  isAuth,
  isAdmin,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
  ],
  examController.updateExam
);

// DELETE exam
router.delete("/exams/:examId", isAuth, isAdmin, examController.deleteExam);

module.exports = router; 