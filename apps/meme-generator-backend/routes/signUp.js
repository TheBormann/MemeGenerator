require("dotenv").config();
var express = require("express");
const bcrypt = require("bcrypt");
const njwt = require("njwt");
const User = require("../models/User.js");

var router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     description: Allows a new user to sign up by providing a username, email, and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account.
 *     responses:
 *       201:
 *         description: User created successfully. Returns the JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid user data.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = req.db;
    const users = db.get("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User(username, email, hashedPassword);
    users.insert(newUser);

    // Create JWT token for the new user
    const claims = { userId: newUser._id };
    const jwt = njwt.create(claims, process.env.JWT_SECRET); // Use environment variable for JWT secret
    jwt.setExpiration(new Date().getTime() + 60 * 60 * 1000); // 1 hour
    const token = jwt.compact();

    res.status(201).json({ message: "Account created successfully", token });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Invalid user data" });
    } else {
      console.error("Error signing up:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
