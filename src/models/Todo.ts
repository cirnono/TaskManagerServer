import { Schema, model, Document } from "mongoose";
import { ILabel } from "./Label";

export interface ITodo extends Document {
  userId: Schema.Types.ObjectId;
  content: string;
  note?: string;
  label?: Schema.Types.ObjectId; // 关联 Label
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
    note: { type: String },
    label: { type: Schema.Types.ObjectId, ref: "Label" },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Todo = model<ITodo>("Todo", TodoSchema);
