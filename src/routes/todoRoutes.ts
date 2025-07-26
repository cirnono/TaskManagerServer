import { Router } from "express";
import { Todo } from "../models/Todo";

const todoRouter = Router();

// GET /todo - 获取所有 Todo
todoRouter.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 其他增删改操作也可以写在这里

export default todoRouter;
