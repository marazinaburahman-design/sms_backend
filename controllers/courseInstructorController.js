import CourseInstructor from "../models/CourseInstructor.js";

// Assign instructor to course
export const assignInstructor = async (req, res) => {
  try {
    const { courseId, instructorId } = req.body;
    
    const assignment = await CourseInstructor.create({
      course: courseId,
      instructor: instructorId
    });
    
    res.json({ message: "Instructor assigned successfully", assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all instructors for a course
export const getCourseinstructors = async (req, res) => {
  try {
    const instructors = await CourseInstructor.find({
      course: req.params.courseId
    }).populate("instructor");
    
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all courses for an instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await CourseInstructor.find({
      instructor: req.params.instructorId
    }).populate("course");
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove instructor from course
export const removeInstructor = async (req, res) => {
  try {
    const { courseId, instructorId } = req.params;
    
    await CourseInstructor.deleteOne({
      course: courseId,
      instructor: instructorId
    });
    
    res.json({ message: "Instructor removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};