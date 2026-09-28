import User from "../models/User.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Attendance from "../models/Attendance.js";
import { askAI } from "../utils/aiService.js";

const round = (value) => Math.round(value * 100) / 100;

const buildAttendanceStats = (records) => {
  const total = records.length;
  const present = records.filter((item) => item.status === "Present").length;
  const absent = records.filter((item) => item.status === "Absent").length;
  const late = records.filter((item) => item.status === "Late").length;

  return {
    total,
    present,
    absent,
    late,
    attendanceRate: total ? round(((present + late) / total) * 100) : 0
  };
};

const getStudentData = async (studentId) => {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const [enrollments, attendance] = await Promise.all([
    Enrollment.find({ student: studentId })
      .populate("course", "courseCode courseName duration fee")
      .lean(),
    Attendance.find({ student: studentId })
      .populate("course", "courseCode courseName")
      .sort({ date: -1 })
      .lean()
  ]);

  const overallAttendance = buildAttendanceStats(attendance);

  const courseAttendanceMap = new Map();
  for (const record of attendance) {
    const courseId = String(record.course?._id || record.course);
    if (!courseAttendanceMap.has(courseId)) courseAttendanceMap.set(courseId, []);
    courseAttendanceMap.get(courseId).push(record);
  }

  const courses = enrollments.map((enrollment) => {
    const courseId = String(enrollment.course?._id || enrollment.course);
    return {
      course: enrollment.course,
      batch: enrollment.batch,
      enrollmentStatus: enrollment.status,
      attendance: buildAttendanceStats(courseAttendanceMap.get(courseId) || [])
    };
  });

  return {
    student: {
      id: student._id,
      studentId: student.studentId,
      name: `${student.firstName} ${student.lastName}`,
      status: student.status
    },
    overallAttendance,
    enrolledCourses: courses
  };
};

export const analyzeStudentPerformance = async (req, res) => {
  try {
    const data = await getStudentData(req.params.studentId);

    const analysis = await askAI({
      instructions: `You are an assistant inside a Student Management System. Analyze only the supplied student data. Do not invent grades, marks, achievements, causes, diagnoses, or facts. This system currently has attendance and enrollment data but no academic marks/grades. Clearly say when academic performance cannot be measured from the available data. Return concise sections: Summary, Attendance observations, Areas to monitor, Suggested support actions. Use neutral language and do not make high-stakes decisions for staff.`,
      input: JSON.stringify(data)
    });

    res.json({
      message: "Student performance analyzed successfully",
      data,
      analysis
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to analyze student performance"
    });
  }
};

export const detectAtRiskStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: "Active" })
      .select("studentId firstName lastName email status")
      .lean();

    const attendance = await Attendance.find({})
      .select("student status date")
      .lean();

    const attendanceByStudent = new Map();
    for (const record of attendance) {
      const key = String(record.student);
      if (!attendanceByStudent.has(key)) attendanceByStudent.set(key, []);
      attendanceByStudent.get(key).push(record);
    }

    const candidates = students.map((student) => {
      const stats = buildAttendanceStats(attendanceByStudent.get(String(student._id)) || []);
      const riskFactors = [];

      if (stats.total === 0) riskFactors.push("No attendance records");
      else if (stats.attendanceRate < 60) riskFactors.push("Attendance below 60%");
      else if (stats.attendanceRate < 75) riskFactors.push("Attendance below 75%");

      if (stats.total > 0 && stats.absent >= 3) {
        riskFactors.push(`${stats.absent} absences recorded`);
      }

      return {
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        attendance: stats,
        riskFactors
      };
    }).filter((student) => student.riskFactors.length > 0);

    const analysis = await askAI({
      instructions: `You are an assistant for student support staff. Review the supplied attendance-based candidates. Do not claim that a student will fail or that a student has a personal problem. Treat these as attention flags only, not definitive risk decisions. Explain the attendance patterns and suggest proportionate follow-up actions. Do not invent information.`,
      input: JSON.stringify({
        criteria: "Attendance-based attention flags only; no grades are available.",
        candidates
      })
    });

    res.json({
      message: "At-risk student analysis generated successfully",
      criteria: "Attendance-based attention flags only",
      candidates,
      analysis
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to detect at-risk students"
    });
  }
};

export const generateDashboardInsights = async (req, res) => {
  try {
    const [users, students, courses, enrollments, attendanceTotal, present, absent, late] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Attendance.countDocuments(),
      Attendance.countDocuments({ status: "Present" }),
      Attendance.countDocuments({ status: "Absent" }),
      Attendance.countDocuments({ status: "Late" })
    ]);

    const activeStudents = await Student.countDocuments({ status: "Active" });
    const activeCourses = await Course.countDocuments({ status: "Active" });
    const attendanceRate = attendanceTotal
      ? round(((present + late) / attendanceTotal) * 100)
      : 0;

    const stats = {
      users,
      students,
      activeStudents,
      courses,
      activeCourses,
      enrollments,
      attendance: {
        total: attendanceTotal,
        present,
        absent,
        late,
        attendanceRate
      }
    };

    const insights = await askAI({
      instructions: `You are an assistant generating dashboard insights for a Student Management System. Use only the supplied aggregate statistics. Do not invent trends over time because no date-series analysis was supplied. Do not infer causes. Return: Key observations, Items to monitor, Suggested administrative actions. Keep it concise and factual.`,
      input: JSON.stringify(stats)
    });

    res.json({
      message: "Dashboard insights generated successfully",
      stats,
      insights
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to generate dashboard insights"
    });
  }
};

export const generateStudentReport = async (req, res) => {
  try {
    const data = await getStudentData(req.params.studentId);

    const report = await askAI({
      instructions: `Create a professional student progress report from the supplied data. The report must use only the supplied facts. Do not invent marks, grades, achievements, behavior, causes, or future outcomes. Because the source data has no grades, label the academic-performance section as unavailable and focus on enrollment and attendance. Use these headings: Student Overview, Enrollment Summary, Attendance Summary, Observations, Suggested Support, Data Limitations. Keep the tone professional and neutral.`,
      input: JSON.stringify(data)
    });

    res.json({
      message: "Student report generated successfully",
      report
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to generate student report"
    });
  }
};
