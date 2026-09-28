import express from "express";
import {
  assignInstructor,
  getCourseinstructors,
  getInstructorCourses,
  removeInstructor
} from "../controllers/courseInstructorController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

// Assign instructor to course (admin only)
router.post("/", admin, assignInstructor);

// Get instructors for a course
router.get("/course/:courseId", getCourseinstructors);

// Get courses for an instructor
router.get("/instructor/:instructorId", getInstructorCourses);

// Remove instructor from course (admin only)
router.delete("/:courseId/:instructorId", admin, removeInstructor);

export default router;