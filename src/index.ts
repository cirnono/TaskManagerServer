import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todoRoutes";
import userRouter from "./routes/userRoutes";

// config
dotenv.config();
await connectDB();
const app = express();

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** ROUTES */
app.get("/", (req, res) => {
    res.send("This is home route");
});

// app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/users", userRouter);

/** SERVER */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
