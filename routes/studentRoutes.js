import express from "express";
import {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

// Get all students (with search, filter, pagination)
router.get("/", getStudents);

// Create student (admin only)
router.post("/", admin, createStudent);

// Get single student
router.get("/:id", getStudentById);

// Update student (admin only)
router.put("/:id", admin, updateStudent);

// Delete student (admin only)
router.delete("/:id", admin, deleteStudent);

export default router;