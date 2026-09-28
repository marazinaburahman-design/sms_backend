const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(
      (error) => error.message
    );
    return res.status(400).json({
      message: errors.join(", ")
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Server error"
  });
};

export default errorMiddleware;