const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHandler");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return sendError(res, 401, req.__("accessDenied"));
  const token = authHeader.split(" ")[1]; // splitting "Bearer" from the token encoded valueand .
  if (!token) return sendError(res, 401, req.__("accessDenied"));

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = decodedToken;
    next();
  } catch (e) {
    return sendError(res, 401, req.__("AuthRequired"));
  }
};

exports.hasRole = (role) => {
  return (req, res, next) => {
    // CHECK: This middleware depends on auth middleware attaching the user data to the req object.
    // It must be passed after auth middleware.
    if (!req.user) return sendError(res, 401, req.__("accessDenied"));
    if (req.user.role !== role)
      return sendError(res, 403, req.__("forbidden"));

    next();
  };
};
