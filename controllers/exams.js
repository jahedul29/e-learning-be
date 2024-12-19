const Exam = require("../models/Exam");
const { validationResult } = require("express-validator");

// Get all exams
exports.getExams = async (req, res, next) => {
  const { _q, _page, _limit, _courseId } = req.query;

  try {
    // Build query object
    const query = {};
    
    // Text search
    if (_q) {
      query.$text = { $search: _q };
    }

    // Filter by course
    if (_courseId && _courseId !== "all") {
      query.courseId = _courseId;
    }

    // Base query with population
    const examQuery = Exam.find(query, {
      ...(query.$text && { score: { $meta: "textScore" } }),
    }).populate("courseId", "_id name");

    // Handle pagination
    if (_page && _limit) {
      const skip = (_page - 1) * _limit;
      examQuery.skip(skip).limit(+_limit);
    }

    // Handle sorting
    if (query.$text) {
      examQuery.sort({ score: { $meta: "textScore" } });
    } else {
      examQuery.sort({ createdAt: -1 }); // Default sort by newest
    }

    // Execute query
    const exams = await examQuery;
    const totalExams = await Exam.countDocuments(query);

    res.status(200).json({
      message: "Fetch all exams successfully!",
      exams,
      pagination: {
        _page: +_page || 1,
        _limit: +_limit || totalExams,
        _totalRows: totalExams,
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch exams!";
    }
    next(error);
  }
};
// Get single exam by ID
exports.getExam = async (req, res, next) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId)
      .populate("courseId", "_id name");

    if (!exam) {
      const error = new Error("Could not find exam!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Fetch single exam successfully!",
      exam,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch exam!";
    }
    next(error);
  }
};

// Create new exam
exports.postExam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const { courseId, title, description } = req.body;

  try {
    const exam = new Exam({
      courseId,
      title,
      description
    });

    const result = await exam.save();

    res.status(201).json({
      message: "Exam created successfully!",
      exam: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to create exam!";
    }
    next(error);
  }
};

// Update exam
exports.updateExam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const { examId } = req.params;
  const { title, description } = req.body;

  try {
    const exam = await Exam.findById(examId);

    if (!exam) {
      const error = new Error("Could not find exam!");
      error.statusCode = 404;
      throw error;
    }

    exam.title = title;
    exam.description = description;

    const result = await exam.save();

    res.status(200).json({
      message: "Exam updated successfully!",
      exam: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to update exam!";
    }
    next(error);
  }
};

// Delete exam
exports.deleteExam = async (req, res, next) => {
  const { examId } = req.params;

  try {
    const result = await Exam.findByIdAndRemove(examId);

    if (!result) {
      const error = new Error("Could not find exam!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Exam deleted successfully!",
      examId: examId,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to delete exam!";
    }
    next(error);
  }
};

// Get exams by course ID
exports.getExamsByCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const exams = await Exam.find({ courseId })
      .populate("courseId", "_id name");

    res.status(200).json({
      message: "Fetch exams by course successfully!",
      exams,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 422;
      error.message = "Failed to fetch exams for course!";
    }
    next(error);
  }
}; 