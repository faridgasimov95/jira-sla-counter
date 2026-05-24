import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env";

/**
 * Account controller.
 * Handles user password change and account deletion.
 */

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new password are required." });
    return;
  }

  if (newPassword.length < 8) {
    res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Change password error: ", err);
    res
      .status(500)
      .json({ error: "Failed to change password. Please try again." });
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: "Password is required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({ error: "Password is incorrect." });
      return;
    }

    await prisma.user.delete({ where: { id: req.user.userId } });

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete account. Please try again." });
  }
};
