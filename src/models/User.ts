import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    isAdmin: Boolean;
    isEmailVerified: Boolean;
    emailVerificationToken: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        isEmailVerified: { type: Boolean, required: true, default: false },
        emailVerificationToken: {
            type: String,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: true },
    }
);

export const User = model<IUser>("User", UserSchema);
