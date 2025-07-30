import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { asyncHandler } from "./asyncHandler";

// Check if user authenticated
export const authticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorised, token failed");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as IUser | null;

    if (!user) {
      res.status(401);
      throw new Error("Not authorised, no token");
    }

    req.user = user;
    next();
  }
);

export const authorisedAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorised as an admin");
  }
};
