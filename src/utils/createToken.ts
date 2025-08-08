import jwt from "jsonwebtoken";
import type { Response } from "express";

interface CreateTokenOptions {
    res: Response;
    userId: string;
}

export function createToken({ res, userId }: CreateTokenOptions): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId }, secret, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;
}
