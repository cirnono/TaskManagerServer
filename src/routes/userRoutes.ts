import { Router } from "express";
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
    updateUser,
    getUserInfo,
    googleOAuthHandler,
} from "../controllers/userController";
import {
    createTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
} from "../controllers/todoController";

// middlewares
import { authenticate, authorisedAdmin } from "../middlewares/authMiddleware";
import {
    createLabel,
    deleteLabel,
    getAllLabels,
    updateLabel,
} from "../controllers/labelController";

const userRouter = Router();

userRouter
    .route("/")
    .post(createUser)
    .get(authenticate, authorisedAdmin, getAllUsers);

userRouter.post("/auth", loginUser);
userRouter.post("/oauth/google", googleOAuthHandler);
// userRouter.post("/oauth/github", githubOAuthHandler);
userRouter.post("/logout", logoutUser);
userRouter
    .route("/profile")
    .get(authenticate, getUserInfo)
    .put(authenticate, updateUser);
userRouter
    .route("/todo")
    .get(authenticate, getAllTodos)
    .post(authenticate, createTodo)
    .delete(authenticate, deleteTodo)
    .put(authenticate, updateTodo);
userRouter
    .route("/label")
    .get(authenticate, getAllLabels)
    .post(authenticate, createLabel)
    .delete(authenticate, deleteLabel)
    .put(authenticate, updateLabel);

export default userRouter;
