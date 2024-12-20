const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const examSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 255
    },
    description: {
      type: String,
      // Optional field, so no required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for question count
examSchema.virtual('totalQuestions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId',
  count: true
});

// Define text index for search
examSchema.index({ title: "text", description: "text" });

// Export the model
module.exports = mongoose.model("Exam", examSchema); 