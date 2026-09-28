import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

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


connectDB();  // ← ADD THIS LINE after dotenv.config()

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sms-frontend-blond-six.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());


app.use(express.json());

// Handles JSON data sent by the frontend
// Example: email and password
// Access using: req.body.email, req.body.password


app.use(express.urlencoded({ extended: true }));

// Handles URL-encoded form data
// Access using: req.body.username, req.body.email


app.use(cookieParser());

// Handles cookies sent by the browser
// Access using: req.cookies.token, req.cookies.user

// Routes
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


app.use(errorMiddleware);  // ← ADD THIS before app.listen()

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});