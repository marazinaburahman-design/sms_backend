const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can perform this action",
      error: "Admin access required"
    });
  }

  next();
};

export default admin;
