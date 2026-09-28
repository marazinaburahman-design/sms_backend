import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCourses);
router.post("/", admin, createCourse);
router.get("/:id", getCourse);
router.put("/:id", admin, updateCourse);
router.delete("/:id", admin, deleteCourse);

export default router;