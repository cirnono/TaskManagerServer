import { Router } from "express";
import { Todo } from "../models/Todo";
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
} from "../controllers/userController";

// middlewares
import { authticate, authorisedAdmin } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter
    .route("/")
    .post(createUser)
    .get(authticate, authorisedAdmin, getAllUsers);

userRouter.post("/auth", loginUser);
userRouter.post("/logout", logoutUser);
//userRouter.route("/todo").get(authenticate, getTodo )

export default userRouter;
