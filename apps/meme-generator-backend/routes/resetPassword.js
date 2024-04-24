const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/emailService");

const router = express.Router();

/**
 * @swagger
 * /request-reset:
 *   post:
 *     summary: Request a password reset link.
 *     description: This route is used to request a password reset link. If the provided email is registered, a reset link will be sent to it.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered user's email address.
 *     responses:
 *       200:
 *         description: An acknowledgment that if the email is registered, a reset link will be sent.
 *       400:
 *         description: Bad request, when the email is not provided.
 */
router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const db = req.db;
  const users = db.get("users");
  const existingUser = await users.findOne({ email });

  if (!existingUser) {
    // It's a good practice not to reveal if an email is registered or not
    return res.status(200).json({
      message: "If the email is registered, a reset link will be sent",
    });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 3600000; // 1 hour from now

  // Save token and expiry to user record
  await users.update({ email }, { $set: { resetToken, tokenExpiry } });

  // Send reset email
  sendPasswordResetEmail(email, resetToken);

  res
    .status(200)
    .json({ message: "If the email is registered, a reset link will be sent" });
});

/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Reset the user's password.
 *     description: This route allows users to reset their password using a valid token.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token provided via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set for the user.
 *     responses:
 *       200:
 *         description: Password reset was successful.
 *       400:
 *         description: Bad request, when the new password is not provided or the token is invalid or expired.
 */
router.post("/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  const db = req.db;
  const users = db.get("users");
  const existingUser = await users.findOne({
    resetToken: token,
    tokenExpiry: { $gt: Date.now() },
  });

  if (!existingUser) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Update the user's password
  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await users.update(
    { resetToken: token },
    { $set: { password: hashedPassword, resetToken: null, tokenExpiry: null } }
  );

  res.status(200).json({ message: "Password has been reset successfully" });
});

module.exports = router;
