import { User } from "../models/User.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createToken } from "../utils/createToken.js";
import bcryptjs from "bcryptjs";

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username);
  console.log(email);
  console.log(password);
});
