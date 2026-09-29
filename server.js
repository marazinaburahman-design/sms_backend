import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import courseInstructorRoutes from "./routes/courseInstructorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

connectDB();

const app = express();

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
].filter(Boolean);

// Only YOUR frontend's preview deployments (not every site on vercel.app)
const previewRegex = /^https:\/\/sms-frontend.*-abdur-rahman7\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = direct browser visit, health chfseck, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || previewRegex.test(origin)) {
        return callback(null, true);
      }

      // Block without throwing (avoids a 500 error)
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body Parser Middleware - ONCE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Student Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-instructors", courseInstructorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Error Middleware - LAST
app.use(errorMiddleware);

// ✅ Start Server (Vercel runs the exported app itself)
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;