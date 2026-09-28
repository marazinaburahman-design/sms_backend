import Student from "../models/Student.js";

// Get all students with search, filter, and pagination
export const getStudents = async (req, res) => {
  try {
    const { search, gender, status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Search by studentId, firstName, lastName, email
    if (search) {
      filter.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Filter by gender
    if (gender) {
      filter.gender = gender;
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limitNum);
    
    // Get students
    const students = await Student.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    res.json({
      students,
      currentPage: pageNum,
      totalPages,
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student
export const createStudent = async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, phone, gender, dateOfBirth, address, guardianName, guardianPhone, status } = req.body;
    
    // Validation
    if (!studentId || !firstName || !lastName || !email || !phone || !gender || !dateOfBirth || !address || !guardianName || !guardianPhone) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if email or studentId already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ error: "Email or Student ID already exists" });
    }
    
    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      guardianName,
      guardianPhone,
      status: status || "Active"
    });
    
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, dateOfBirth, address, guardianName, guardianPhone, status } = req.body;
    
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Update fields
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (gender) student.gender = gender;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (address) student.address = address;
    if (guardianName) student.guardianName = guardianName;
    if (guardianPhone) student.guardianPhone = guardianPhone;
    if (status) student.status = status;
    
    student = await student.save();
    
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};