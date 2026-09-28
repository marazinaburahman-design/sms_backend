import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  analyzeStudentPerformance,
  detectAtRiskStudents,
  generateDashboardInsights,
  generateStudentReport
} from "../controllers/aiController.js";

const router = express.Router();

// All AI endpoints require an authenticated user.
router.use(protect);

router.get("/student-performance/:studentId", analyzeStudentPerformance);
router.get("/at-risk-students", detectAtRiskStudents);
router.get("/dashboard-insights", generateDashboardInsights);
router.get("/student-report/:studentId", generateStudentReport);

export default router;
