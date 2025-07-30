import { Router } from "express";
import { Todo } from "../models/Todo";

const todoRouter = Router();

// GET /todo - 获取所有 Todo
todoRouter.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /todo - 新增 Todo
todoRouter.post("/", async (req, res) => {
  try {
    const { userId, content, note, label, deadline, order } = req.body;
    const todo = new Todo({
      userId,
      content,
      note,
      label,
      deadline,
      order,
    });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /todo - 删除 Todo
todoRouter.post("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST /todo - 更新 Todo
todoRouter.post("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

export default todoRouter;
