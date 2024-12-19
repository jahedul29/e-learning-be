const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

// Routers
const authRouter = require("./routes/auth");
const adminCategoryRouter = require("./routes/adminCategory");
const adminCourseRouter = require("./routes/adminCourse");
const adminSectionRouter = require("./routes/adminSection");
const adminLessonRouter = require("./routes/adminLesson");
const adminUserRouter = require("./routes/adminUser");
const adminOrderRouter = require("./routes/adminOrder");
const clientRouter = require("./routes/client");
const reportRouter = require("./routes/report");
const examRouter = require("./routes/exam");
const questionRouter = require("./routes/question");
const app = express();

const port = process.env.PORT || 9000;

const MONGODB_URI = "mongodb+srv://e-learning-user:JDa27qF7e6mIm4sS@cluster0.n6je5.mongodb.net/e_learning";

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, userId, adminRole, userRole"
  );
  next();
});

// Routes
app.use("/auth", authRouter);
app.use("/admin", adminCategoryRouter);
app.use("/admin", adminCourseRouter);
app.use("/admin", adminSectionRouter);
app.use("/admin", adminLessonRouter);
app.use("/admin", adminUserRouter);
app.use("/admin", adminOrderRouter);
app.use("/admin", reportRouter);
app.use(clientRouter);
app.use(examRouter);
app.use(questionRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const errorType = error.errorType || "unknown";
  const data = error.data;

  res.status(status).json({
    message: message,
    errorType,
    data: data,
  });
});

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
