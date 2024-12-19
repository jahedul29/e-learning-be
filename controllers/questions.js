const Question = require("../models/Question");
const { validationResult } = require("express-validator");

// Get all questions with filtering
exports.getQuestions = async (req, res, next) => {
  const { _q, _page, _limit, _examId } = req.query;

  try {
    // Build query object
    const query = {};
    
    // Text search
    if (_q) {
      query.$text = { $search: _q };
    }

    // Filter by exam
    if (_examId && _examId !== "all") {
      query.examId = _examId;
    }

    // Base query with population
    const questionQuery = Question.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    }).populate("examId", "_id title");

    // Handle pagination
    if (_page && _limit) {
      const skip = (_page - 1) * _limit;
      questionQuery.skip(skip).limit(+_limit);
    }

    // Handle sorting
    if (query.$text) {
      questionQuery.sort({ score: { $meta: "textScore" } });
    } else {
      questionQuery.sort({ createdAt: -1 });
    }

    // Execute query
    const questions = await questionQuery;
    const totalQuestions = await Question.countDocuments(query);

    res.status(200).json({
      message: "Fetch all questions successfully!",
      questions,
      pagination: {
        _page: +_page || 1,
        _limit: +_limit || totalQuestions,
        _totalRows: totalQuestions,
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch questions!";
    }
    next(error);
  }
};

// Get question by ID
exports.getQuestion = async (req, res, next) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId)
      .populate("examId", "_id title");

    if (!question) {
      const error = new Error("Question not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Fetch question successfully!",
      question,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch question!";
    }
    next(error);
  }
};

// Create question
exports.postQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const { examId, title, questionType, options, correctAnswer, marks } = req.body;

  try {
    const question = new Question({
      examId,
      title,
      questionType,
      options,
      correctAnswer,
      marks
    });

    const result = await question.save();

    res.status(201).json({
      message: "Question created successfully!",
      question: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to create question!";
    }
    next(error);
  }
};

// Update question
exports.updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const { questionId } = req.params;
  const { title, questionType, options, correctAnswer, marks } = req.body;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      const error = new Error("Question not found!");
      error.statusCode = 404;
      throw error;
    }

    question.title = title;
    question.questionType = questionType;
    question.options = options;
    question.correctAnswer = correctAnswer;
    question.marks = marks;

    const result = await question.save();

    res.status(200).json({
      message: "Question updated successfully!",
      question: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to update question!";
    }
    next(error);
  }
};

// Delete question
exports.deleteQuestion = async (req, res, next) => {
  const { questionId } = req.params;

  try {
    const result = await Question.findByIdAndRemove(questionId);

    if (!result) {
      const error = new Error("Question not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Question deleted successfully!",
      questionId: questionId,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to delete question!";
    }
    next(error);
  }
};

// Get questions by exam ID
exports.getQuestionsByExam = async (req, res, next) => {
  const { examId } = req.params;

  try {
    const questions = await Question.find({ examId })
      .populate("examId", "_id title");

    res.status(200).json({
      message: "Fetch questions by exam successfully!",
      questions,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch questions for exam!";
    }
    next(error);
  }
}; 