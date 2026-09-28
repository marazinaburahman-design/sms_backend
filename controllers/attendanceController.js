import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  const { course, student, date, status } = req.query;
  const query = {};
  if (course) {
    query.course = course;
  }
  if (student) {
    query.student = student;
  }
  if (status) {
    query.status = status;
  }
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.date = { $gte: start, $lt: end };
  }
  const attendance = await Attendance.find(query)
    .populate("student", "studentId firstName lastName")
    .populate("course", "courseCode courseName")
    .sort({ date: -1 });
  res.json({ attendance });
};

export const getAttendanceRecord = async (req, res) => {
  const record = await Attendance.findById(req.params.id)
    .populate("student")
    .populate("course");
  if (!record) {
    return res.status(404).json({ message: "Attendance record not found" });
  }
  res.json({ attendance: record });
};

export const createAttendance = async (req, res) => {
  const { student, course, date, status, remarks } = req.body;
  
  const attendanceDate = new Date(date);
  const start = new Date(attendanceDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  
  const existing = await Attendance.findOne({
    student,
    course,
    date: { $gte: start, $lt: end }
  });
  
  if (existing) {
    return res.status(400).json({
      message: "Attendance already marked for this student"
    });
  }
  
  const record = await Attendance.create({
    student,
    course,
    date: start,
    status,
    remarks
  });
  
  const populated = await Attendance.findById(record._id)
    .populate("student")
    .populate("course");
  
  res.status(201).json({
    message: "Attendance marked successfully",
    attendance: populated
  });
};

export const updateAttendance = async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate("student")
    .populate("course");
  
  if (!record) {
    return res.status(404).json({ message: "Attendance record not found" });
  }
  
  res.json({
    message: "Attendance updated successfully",
    attendance: record
  });
};

export const deleteAttendance = async (req, res) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) {
    return res.status(404).json({ message: "Attendance record not found" });
  }
  res.json({ message: "Attendance deleted successfully" });
};
