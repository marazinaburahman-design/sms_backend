import mongoose from "mongoose";

const courseInstructorSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Prevent duplicate assignments
courseInstructorSchema.index(
  { course: 1, instructor: 1 }, 
  { unique: true }
);

const CourseInstructor = mongoose.model("CourseInstructor", courseInstructorSchema);
export default CourseInstructor;