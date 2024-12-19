const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ['radio'],
      required: true,
      default: 'radio'
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Options must be a non-empty array'
      }
    },
    correctAnswer: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

// Text search index
questionSchema.index({ title: "text" });

module.exports = mongoose.model("Question", questionSchema); 