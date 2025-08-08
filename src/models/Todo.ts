import { Schema, model, Document } from "mongoose";
import { ILabel } from "./Label";

interface INote {
    text: string;
    createdAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false, timestamps: { createdAt: true, updatedAt: true } }
);

// order should start from 1
export interface ITodo extends Document {
    userId: Schema.Types.ObjectId;
    content: string;
    notes?: INote[];
    labels?: Schema.Types.ObjectId[]; // 关联 Label
    deadline?: Date;
    completed: boolean;
    completedAt?: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        notes: { type: [NoteSchema], default: [] },
        labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],
        deadline: { type: Date },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        order: { type: Number },
    },
    {
        timestamps: true,
    }
);

export const Todo = model<ITodo>("Todo", TodoSchema);
