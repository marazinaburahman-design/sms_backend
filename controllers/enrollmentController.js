import Enrollment from "../models/Enrollment.js";

export const getEnrollments = async (req, res) => {
  const { course, student, status } = req.query;
  const query = {};
  if (course) {
    query.course = course;
  }
  if (student) {
    query.student = student;
  }
  if (status) {
    query.status = status;
  }
  const enrollments = await Enrollment.find(query)
    .populate("student", "studentId firstName lastName email")
    .populate("course", "courseCode courseName fee")
    .sort({ enrollmentDate: -1 });
  res.json({ enrollments });
};

export const getEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate("student")
    .populate("course");
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  res.json({ enrollment });
};

export const createEnrollment = async (req, res) => {
  const enrollment = await Enrollment.create(req.body);
  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate("student")
    .populate("course");
  res.status(201).json({
    message: "Enrollment created successfully",
    enrollment: populatedEnrollment
  });
};

export const updateEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate("student")
    .populate("course");
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  res.json({
    message: "Enrollment updated successfully",
    enrollment
  });
};

export const deleteEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  res.json({ message: "Enrollment deleted successfully" });
};
