import { Request } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Label } from "../models/Label.js";

export const getAllLabels = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const labels = await Label.find({ userId: reqUser._id });
    if (labels) {
        res.status(201).json(labels);
    } else {
        res.status(401).send({ message: "This user has no labels yet" });
    }
});

// get user id from cookie
export const createLabel = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }
    const userId = reqUser._id;
    const { name, color } = req.body;
    const newTodo = new Label({
        userId,
        name,
        color,
    });

    try {
        await newTodo.save();
        res.status(201).json({
            _id: newTodo._id,
            userId: newTodo.userId,
            name: newTodo.name,
            color: newTodo.color,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid label data");
    }
});

export const deleteLabel = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const { name } = req.body;

    try {
        const labelDeleted = await Label.findOneAndDelete({
            userId: reqUser._id,
            name: name,
        });
        res.status(201).json({
            message: "Label deleted",
            deleted: labelDeleted,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Error deleting target label");
    }
});

export const updateLabel = asyncHandler(async (req: Request, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const { name, updates } = req.body;
    const label = await Label.findOne({
        userId: reqUser._id,
        name: name,
    });

    if (label) {
        label.name = updates.name || label.name;
        label.color = updates.color || label.color;

        const updatedLabel = await label.save();

        res.json({
            _id: updatedLabel._id,
            userId: updatedLabel.userId,
            name: updatedLabel.name,
            color: updatedLabel.color,
        });
    } else {
        res.status(404);
        throw new Error("Label not found");
    }
});
