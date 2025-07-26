import { Schema, model, Document } from "mongoose";

export interface ILabel extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  color?: string; // HEX or CSS color string
}

const LabelSchema = new Schema<ILabel>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  color: { type: String, default: "#000000" },
});

export const Label = model<ILabel>("Label", LabelSchema);
