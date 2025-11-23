import express from "express";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.get("/", (_, res) => res.json({ message: "Server is running" }));
app.use("/auth", authRoutes);
app.use("/task", authMiddleware, taskRoutes);
app.use("/users", authMiddleware, usersRoutes);
