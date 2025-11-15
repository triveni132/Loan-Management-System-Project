import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie
    let token = req.cookies?.token;

    // 2️⃣ Fallback: Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    // 3️⃣ No token → Unauthorized
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 4️⃣ Verify token directly here
    let decoded;
    try {
      console.log(JWT_SECRET);
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: err.message,
      });
    }

    // 5️⃣ Attach user data to req
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed",
      error: err.message,
    });
  }
};

// ROLE MIDDLEWARE
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
