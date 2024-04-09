require("dotenv").config();
var express = require("express");
const njwt = require("njwt");
const authenticateToken = require("../middleware/authenticateToken.js");

var router = express.Router();

/**
 * @swagger
 * /validateToken:
 *   post:
 *     summary: Validate a JWT token
 *     description: Validates the provided JWT token to ensure it's still valid.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth:
 *           type: http
 *           scheme: bearer
 *     responses:
 *       200:
 *         description: Token is valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *       401:
 *         description: Token is invalid or expired.
 *       500:
 *         description: Internal server error.
 */

router.post("/", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    res.status(200).json({ isValid: true });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
