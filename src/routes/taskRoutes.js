import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

//GET TASK
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === "oldest" ? "asc" : "desc";
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const where = user.role === "basic" ? { ownerId: userId } : {};

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: sort },
      skip,
      take: limit,
    });

    const totalTasks = await prisma.task.count({ where });

    return res.json({
      page,
      limit,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//CREATE TASK
router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "basic") {
      return res
        .status(403)
        .json({ message: "Only basic users can create tasks" });
    }

    const task = await prisma.task.create({
      data: {
        body,
        ownerId: userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = parseInt(req.params.id);
    const { body } = req.body;

    if (!body) {
      return res
        .status(400)
        .json({ message: "Body is required to update task" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (user.role === "basic" && task.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "Basic users can only update their own tasks" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { body },
    });

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
