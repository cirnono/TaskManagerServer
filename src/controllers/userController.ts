import { User } from "../models/User.js";
import { Todo } from "../models/Todo.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username: username,
        email: email,
        passwordHash: hashedPassword,
    });

    try {
        await newUser.save();
        const userId = newUser._id as string;
        createToken({ res, userId });

        res.status(201).json({
            _id: userId,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Please fill all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        const isPasswordValid = await bcrypt.compare(
            password,
            userExists.passwordHash
        );
        const userId = userExists._id as string;
        if (isPasswordValid) {
            createToken({ res, userId });
            res.status(201).json({
                _id: userId,
                username: userExists.username,
                email: userExists.email,
                isAdmin: userExists.isAdmin,
            });
        } else {
            res.status(401).json({
                message: "Credentials does not match, please try again",
            });
        }
    } else {
        res.json({ message: "Credentials does not match, please try again" });
    }
});

export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

export const getUserInfo = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }
    const user = await User.findById(reqUser._id);

    const todos = await Todo.find({ userId: reqUser._id }).lean();
    if (user) {
        res.status(201).json({
            username: user.username,
            email: user.email,
            todos: todos,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }
    const user = await User.findById(reqUser._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.passwordHash = hashedPassword;
        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

export const googleOAuthHandler = asyncHandler(
    async (requestAnimationFrame, res) => {}
);
