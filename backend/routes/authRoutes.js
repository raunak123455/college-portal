const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const User = require("../models/userModel");

// Add a test route
router.get("/test", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        email: user.email,
        role: user.role,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
