import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  const { search = "", status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { courseCode: { $regex: search, $options: "i" } },
      { courseName: { $regex: search, $options: "i" } }
    ];
  }

  if (status) {
    query.status = status;
  }

  const courses = await Course.find(query).sort({ createdAt: -1 });

  res.json({ courses });
};

export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found"
    });
  }

  res.json({ course });
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    message: "Course created successfully",
    course
  });
};

export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course) {
    return res.status(404).json({
      message: "Course not found"
    });
  }

  res.json({
    message: "Course updated successfully",
    course
  });
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found"
    });
  }

  res.json({
    message: "Course deleted successfully"
  });
};