import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import LoanOfficer from "../models/LoanOfficer.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, income, creditScore, branch } =
      req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required (name, email, password, role)",
      });
    }

    // Accept only valid roles
    if (!["CUSTOMER", "OFFICER"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be CUSTOMER or OFFICER" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      role,
    });

    let record = null;

    // 👉 If CUSTOMER → create customer profile
    if (role === "CUSTOMER") {
      record = await Customer.create({
        userId: newUser._id,
        income: income || 0,
        creditScore: creditScore || 0,
      });
    }

    // 👉 If OFFICER → create loan officer profile
    if (role === "OFFICER") {
      record = await LoanOfficer.create({
        userId: newUser._id,
        branch: branch || "MAIN",
      });
    }

    return res.status(201).json({
      message: `${role} registered successfully`,
      userId: newUser._id,
      secondaryId: record?._id, // customerId or officerId
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate token correctly
    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    let profileData = null;

    // Fetch profile based on role
    if (user.role === "CUSTOMER") {
      profileData = await Customer.findOne({ userId: user._id });
    } else if (user.role === "OFFICER") {
      profileData = await LoanOfficer.findOne({ userId: user._id });
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for cross-domain
      sameSite: "none", // REQUIRED for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password before sending
    user.password = undefined;

    return res.status(200).json({
      message: "Logged in successfully",
      user,
      role: user.role,

      // send CUSTOMER fields only if user is customer
      salary: user.role === "CUSTOMER" ? profileData?.income : undefined,
      creditScore:
        user.role === "CUSTOMER" ? profileData?.creditScore : undefined,

      // send OFFICER fields only if user is loan officer
      branch: user.role === "OFFICER" ? profileData?.branch : undefined,
      employeeId: user.role === "OFFICER" ? profileData?.employeeId : undefined,

      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    let profileData = null;
    if (user.role === "CUSTOMER") {
      profileData = await Customer.findOne({ userId: user._id });
    } else if (user.role === "OFFICER") {
      profileData = await LoanOfficer.findOne({ userId: user._id });
    }

    const newToken = generateToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true, // required for cross-domain
      sameSite: "none", // REQUIRED for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Profile loaded",
      user,
      role: user.role,

      // send CUSTOMER fields only if user is customer
      salary: user.role === "CUSTOMER" ? profileData?.income : undefined,
      creditScore:
        user.role === "CUSTOMER" ? profileData?.creditScore : undefined,

      // send OFFICER fields only if user is loan officer
      branch: user.role === "OFFICER" ? profileData?.branch : undefined,
      token: newToken,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
