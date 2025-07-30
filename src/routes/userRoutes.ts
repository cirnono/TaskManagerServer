import { Router } from "express";
import { Todo } from "../models/Todo";
import { createUser } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/", createUser);

export default userRouter;
