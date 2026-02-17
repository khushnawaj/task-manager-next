import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { ioRef } from "../socket.js";

export const getTaskComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId })
      .populate("author", "name email avatarUrl")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Text required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const comment = await Comment.create({
      taskId,
      author: req.user._id,
      text
    });

    const populated = await comment.populate("author", "name email avatarUrl");

    if (ioRef) {
      ioRef.to(`project:${task.projectId}`).emit("comment:created", { comment: populated });
    }

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};
