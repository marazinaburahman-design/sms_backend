import express from "express";
import {
  getAttendance,
  getAttendanceRecord,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from "../controllers/attendanceController.js";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

// Get all attendance
router.get("/", getAttendance);

// Create attendance (admin only)
router.post("/", admin, createAttendance);

// Get single attendance record
router.get("/:id", getAttendanceRecord);

// Update attendance (admin only)
router.put("/:id", admin, updateAttendance);

// Delete attendance (admin only)
router.delete("/:id", admin, deleteAttendance);

export default router;
