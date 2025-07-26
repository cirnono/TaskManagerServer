import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

// temp database
import type { ITodo } from "./models/Todo";
import { Schema, model, Document, Types } from "mongoose";
let todos: ITodo[] = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { content } = req.body;
  const newTodo: ITodo = {
    userId: new Types.ObjectId(),
    content,
    note: "optional",
    // label: optional,
    deadline: new Date(),
    completed: false,
    completedAt: new Date(),
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/** SERVER */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
