import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import todoRouter from "./routes/todoRoutes";
import userRouter from "./routes/userRoutes";

// config
dotenv.config();
await connectDB();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/todo", todoRouter);
app.use("/api/v1/user", userRouter);

/** SERVER */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
