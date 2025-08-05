import { Router } from "express";

import {
    createTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
} from "../controllers/todoController";
// middlewares
import { authenticate, authorisedAdmin } from "../middlewares/authMiddleware";

const todoRouter = Router();

// GET /todo - 获取所有 Todo
// POST /todo - 新增 Todo
// // POST /todo - 删除 Todo
todoRouter
    .route("/")
    .get(authenticate, authorisedAdmin, getAllTodos)
    .post(authenticate, createTodo)
    .delete(authenticate, deleteTodo)
    .put(authenticate, updateTodo);

export default todoRouter;
