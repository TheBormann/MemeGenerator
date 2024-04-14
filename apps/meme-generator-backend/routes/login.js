require("dotenv").config();
var express = require("express");
const bcrypt = require("bcrypt");
const njwt = require("njwt");

var router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the meme generator
 *     description: Authenticates the user and creates a secure token for session management
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       '200':
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated sessions
 *       '401':
 *         description: Unauthorized access, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Explanation of the error
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the nature of the server error
 */
router.post("/", async (req, res) => {
  try {
    const db = req.db;
    const users = db.get("users");
    const user = await users.findOne({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const claims = { userId: user._id };
    const jwt = njwt.create(claims, process.env.JWT_SECRET);
    const expiration = new Date(jwt.body.exp * 1000); // 1 hour
    jwt.setExpiration(expiration); 

    console.error(claims);

    const token = jwt.compact();
    res.send({ token, expiration });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
