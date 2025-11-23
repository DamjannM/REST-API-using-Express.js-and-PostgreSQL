import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (role != "basic" && role != "admin") {
    return res.status(403).send({ message: "Role must be 'basic' or 'admin'" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
      },
    });
    if (!user) {
      res.status(404).send({ message: "Error while creating user" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: "24h",
    });
    res.json({ token, user });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).send({ message: "User already exists" });
    }

    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const passwordIsValid = bcrypt.compareSync(password, String(user.password));
  if (!passwordIsValid) {
    return res.status(401).send({ message: "Invalid password" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: "24h",
  });
  console.log(user);
  res.json({ token });
});

export default router;
