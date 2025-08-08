import { User } from "../models/User.js";
import { Todo } from "../models/Todo.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/emailHandler.js";

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username: username,
        email: email,
        passwordHash: hashedPassword,
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
    });

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
        email,
        "Verify your email",
        `Click here: ${verificationUrl}`
    );

    try {
        await newUser.save();
        const userId = newUser._id as string;

        res.status(201).json({
            _id: userId,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            message: "User created. Please verify your email",
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export const confirmUserRegistration = asyncHandler(async (req, res) => {
    const { token } = req.body;
    console.log(token)
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user)
        return res.status(400).json({ message: "Invalid or expired token" });
    user.isEmailVerified = true;
    user.emailVerificationToken = "";
    await user.save();

    const userId = user._id as string;
    createToken({ res, userId });

    res.json({ message: "Email verified successfully" });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Please fill all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        const isEmailVerified = await userExists.isEmailVerified;
        if (!isEmailVerified) {
            res.status(401).json({
                message: "Please verify your email first",
            });
        }
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

        res.status(200).json({
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

export const resetPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(401).json({ message: "Invalid Request" });
    }

    try {
        // verify if this email is registered
        const user = await User.findOne({ email: email });
        if (user && user.isEmailVerified) {
            // send an email to change password
            const verificationToken = uuidv4();
            const resetPasswordLink = `http://localhost:3000/auth/reset-password?token=${verificationToken}`;
            user.emailVerificationToken = verificationToken;
            await user.save();
            sendEmail(
                email,
                "Reset your password",
                `Click here to reset your password: ${resetPasswordLink}`
            );
        }
        res.status(200).json({
            message: "An email has sent to your email if it is registered",
        });
    } catch (error) {
        // need to modify to prevent enumeration attack
        throw new Error("Error validating your email");
    }
});

export const getEmailFromToken = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(401).json({ message: "Invalid Request" });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (user) {
        res.status(200).json({ email: user.email });
    } else {
        res.status(404).json({ message: "Invalid Token" });
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { newPassword, token } = req.body;
    if (!newPassword) {
        res.status(401).json({ message: "Invalid Request" });
    }
    const user = await User.findOne({ emailVerificationToken: token });

    if (user && user.emailVerificationToken) {
        try {
            if (token != user.emailVerificationToken) {
                res.status(401).json({ message: "Invalid Request" });
            } else {
                user.emailVerificationToken = "";

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.passwordHash = hashedPassword;

                await user.save();
                res.status(200).json({
                    message: "Password is reset successfully",
                });
            }
        } catch (error) {
            throw new Error("Error saving new password, please try again");
        }
    } else {
        res.status(401).json({ message: "Invalid Request" });
    }
});
