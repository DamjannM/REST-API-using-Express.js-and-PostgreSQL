import express from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const targetUserId = parseInt(req.params.id);
    const { firstName, lastName, username, email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (user.role === "basic" && userId !== targetUserId) {
      return res
        .status(403)
        .json({ message: "Basic users can only update their own profile" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = bcrypt.hashSync(password, 10);
    if (role && user.role === "admin") updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let users;

    if (user.role === "admin") {
      users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      res.status(403).json({ message: "Only admin can see all users" });
    }

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
