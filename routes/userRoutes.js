import express from "express";
import { getInstructors } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, admin);
router.get("/instructors", getInstructors);

export default router;
