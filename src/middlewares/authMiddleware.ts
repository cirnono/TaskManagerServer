import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { asyncHandler } from "./asyncHandler";

// Check if user authenticated
export const authenticate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.jwt;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                    userId: string;
                };
                const user = (await User.findById(decoded.userId).select(
                    "-passwordHash"
                )) as IUser;

                req.user = user;
                next();
            } catch (error) {
                res.status(401).send("Not authorised, token failed");
            }
        } else {
            res.status(401).send("Not authorised, no token");
        }
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
