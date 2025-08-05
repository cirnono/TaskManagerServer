import { Todo } from "../models/Todo";
import { Request } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { User } from "../models/User";

export const getAllTodos = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const todos = await Todo.find({ userId: reqUser._id });
    if (todos) {
        res.status(201).json(todos);
    } else {
        res.status(401).send({ message: "This user has no todos yet" });
    }
});

// get user id from cookie
export const createTodo = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }
    const userId = reqUser._id;
    const { content, notes, labels, deadline, order } = req.body;
    const newTodo = new Todo({
        userId,
        content,
        notes,
        labels,
        deadline,
        order,
    });

    try {
        await newTodo.save();
        res.status(201).json({
            _id: newTodo._id,
            userId: newTodo.userId,
            content: newTodo.content,
            notes: newTodo.notes,
            labels: newTodo.labels,
            deadline: newTodo.deadline,
            order: newTodo.order,
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid todo data");
    }
});

export const deleteTodo = asyncHandler(async (req, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const { order } = req.body;

    try {
        const todoDeleted = await Todo.findOneAndDelete({
            userId: reqUser._id,
            order: order,
        });
        try {
            await Todo.updateMany(
                { userId: reqUser._id, order: { $gt: order } },
                { $inc: { order: -1 } }
            );
        } catch (error) {
            res.status(400);
            throw new Error("Error updating todo orders");
        }
        res.status(201).json({ message: "Todo deleted", deleted: todoDeleted });
    } catch (error) {
        res.status(400);
        throw new Error("Error deleting target todo");
    }
});

export const updateTodo = asyncHandler(async (req: Request, res) => {
    const reqUser = req.user;
    if (!reqUser) {
        res.status(401);
        throw new Error("Invalid Request");
    }

    const { order, updates } = req.body;
    const todo = await Todo.findOne({
        userId: reqUser._id,
        order: order,
    });

    if (todo) {
        todo.content = updates.content || todo.content;
        todo.notes = updates.note || todo.notes;
        todo.labels = updates.label || todo.labels;
        todo.deadline = updates.deadline || todo.deadline;
        todo.completed = updates.completed || todo.completed;

        if (updates.order) {
            if (updates.order > 0) {
                const targetOrder = updates.order;
                const swapTodo = await Todo.findOne({
                    userId: reqUser._id,
                    order: targetOrder,
                });
                if (swapTodo) {
                    // avoid unique conflict
                    swapTodo.order = -1;
                    await swapTodo.save();

                    todo.order = targetOrder;
                    await todo.save();

                    swapTodo.order = order;
                    await swapTodo.save();
                } else {
                    todo.order =
                        (await Todo.countDocuments({ userId: reqUser._id })) -
                        1;
                    await Todo.updateMany(
                        { userId: reqUser._id, order: { $gt: targetOrder } },
                        { $inc: { order: -1 } }
                    );
                }
            } else {
                res.status(400);
                throw new Error("Invalid Order");
            }
        }

        const updatedTodo = await todo.save();

        res.json({
            _id: updatedTodo._id,
            userId: updatedTodo.userId,
            content: updatedTodo.content,
            notes: updatedTodo.notes,
            labels: updatedTodo.labels,
            deadline: updatedTodo.deadline,
            order: updatedTodo.order,
            completed: updatedTodo.completed,
        });
    } else {
        res.status(404);
        throw new Error("Todo not found");
    }
});
