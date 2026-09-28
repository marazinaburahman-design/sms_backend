import User from "../models/User.js";

// Admin-only list of staff accounts that can be assigned as course instructors.
export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "staff" })
      .select("_id name email role")
      .sort({ name: 1 });

    res.json({ instructors });
  } catch (error) {
    res.status(500).json({ message: "Could not load instructors", error: error.message });
  }
};
