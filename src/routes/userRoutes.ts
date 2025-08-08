import { Router } from "express";
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
    updateUser,
    getUserInfo,
    googleOAuthHandler,
    confirmUserRegistration,
    resetPasswordRequest,
    resetPassword,
    getEmailFromToken,
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
    .get(authenticate, authorisedAdmin, getAllUsers)
    .post(createUser);

userRouter.post("/auth", loginUser);
userRouter.post("/oauth/google", googleOAuthHandler);
// userRouter.post("/oauth/github", githubOAuthHandler);
userRouter.post("/logout", logoutUser);
userRouter.post("/email", getEmailFromToken);
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
userRouter.route("/verify-email").post(confirmUserRegistration);
userRouter
    .route("/reset-password")
    .post(resetPasswordRequest)
    .put(resetPassword);
// 如果用户目前没有verification code储存在database里，有黑客通过PUT password， http://localhost:3001/api/v1/user/reset-password, 来改密码怎么办

export default userRouter;
