var express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/authenticateToken.js");
var router = express.Router();

/**
 * @swagger
 * /updateUserData:
 *   patch:
 *     summary: Update an existing user's information
 *     description: Allows updating a user's username and password.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username for the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password for the user account.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Missing required fields or invalid user data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieved from the JWT
    const { username, password, read_feed, read_details, read_comments } = req.body;

    // Input Validation
    if (!userId || (!username && !password)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = req.db;
    const users = db.get("users");

    // Find the user by ID
    const user = await users.findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username and/or password
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 8);
    user.read_feed = read_feed;
    user.read_details = read_details;
    user.read_comments = read_comments;

    // Save the updated user information
    await users.update({ _id: userId }, { $set: user });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
