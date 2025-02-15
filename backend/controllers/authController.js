const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Registration attempt:", { name, email, role });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // Default role is student
    });

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request body:", req.body); // Log the request body

    // Find user and explicitly select all fields including password
    const user = await User.findOne({ email }).select("+password");
    console.log("Raw user from database:", user); // Log the raw user object

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "User not found" });
    }

    // Log user details
    console.log("User details:", {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
    });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const tokenPayload = {
      id: user._id,
      role: user.role || "student", // Fallback to student if role is undefined
    };
    console.log("Token payload:", tokenPayload); // Log the token payload

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "30d" }
    );

    // Prepare response
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "student", // Fallback to student if role is undefined
      token,
    };
    console.log("Response being sent:", response); // Log the response

    res.json(response);
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
      details: "Check server logs for more information",
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
};
