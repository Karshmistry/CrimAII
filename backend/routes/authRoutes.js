import express from "express";
import bcrypt from "bcryptjs"; // 🔄 better cross-platform support
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ⚠️ ensure exact filename match (capital U)

const router = express.Router();

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
  console.log("📥 Signup body:", req.body);

  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User saved successfully:", newUser);

    // Send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("⚠️ No user found with email:", email);
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Wrong password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("✅ Login successful for:", email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

export default router;
