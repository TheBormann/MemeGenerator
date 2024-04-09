require("dotenv").config();
var express = require("express");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/authenticateToken.js");

var router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /getUserData:
 *   get:
 *     summary: Retrieve user data based on JWT token
 *     description: Returns the user's username and email from the verified JWT token.
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Token is invalid or expired.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const db = req.db;
    const users = db.get("users");

    const user = await users.findOne({ _id: ObjectId(userId) });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = user;
    res.status(200).json({ username, email });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
