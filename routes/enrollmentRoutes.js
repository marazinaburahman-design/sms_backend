import express from "express";
import {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} from "../controllers/enrollmentController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

// Get all enrollments
router.get("/", getEnrollments);

// Create enrollment (admin only)
router.post("/", admin, createEnrollment);

// Get single enrollment
router.get("/:id", getEnrollment);

// Update enrollment (admin only)
router.put("/:id", admin, updateEnrollment);

// Delete enrollment (admin only)
router.delete("/:id", admin, deleteEnrollment);

export default router;
