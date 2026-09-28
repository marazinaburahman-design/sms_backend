import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    batch: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Dropped"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.index(
  { student: 1, course: 1, batch: 1 },
  { unique: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;