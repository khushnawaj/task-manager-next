import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Organization from "../models/Organization.js";
import AuditLog from "../models/AuditLog.js";
import { ioRef } from "../socket.js";

const router = express.Router({ mergeParams: true });

// Helper to check access (AuthZ)
const checkAccess = async (req, projectId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const org = await Organization.findById(project.organizationId);
  if (!org) throw new Error("Organization not found");

  // Check Membership
  const member = org.members.find(m => m.userId.toString() === req.user._id.toString());
  if (!member) throw new Error("Access denied: Not a member of Organization");

  // Check Project Membership (if enforced)
  if (!project.members.includes(req.user._id.toString())) {
    throw new Error("Access denied: Not a member of Project");
  }

  return { project, org, member };
};

// GET /assigned/me (My Tasks)
router.get("/assigned/me", requireAuth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignees: req.user._id, deletedAt: null })
      .populate("projectId", "name key")
      .populate("assignees", "name email")
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /:projectId/tasks (Create)
router.post("/:projectId/tasks", requireAuth, async (req, res, next) => {
  // If this route is hit via /api/projects/:projectId/tasks
  try {
    const { projectId } = req.params;
    const { project, org } = await checkAccess(req, projectId);

    const { title, description, assignees, dueDate, status } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const task = await Task.create({
      projectId,
      title,
      description,
      assignees: assignees || [],
      dueDate,
      status: status || "todo",
      createdBy: req.user._id
    });

    await AuditLog.create({
      organizationId: org._id,
      projectId,
      actor: req.user._id,
      action: "task.created",
      meta: { taskId: task._id, title }
    });

    ioRef?.to(`project:${projectId}`).emit("task:created", { task });
    res.status(201).json(task);
  } catch (err) {
    if (err.message.includes("Access denied")) return res.status(403).json({ error: err.message });
    if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
    next(err);
  }
});

// GET /:projectId/tasks (List)
router.get("/:projectId/tasks", requireAuth, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await checkAccess(req, projectId);
    const tasks = await Task.find({ projectId, deletedAt: null }).limit(100).populate("assignees", "name email");
    res.json(tasks);
  } catch (err) {
    if (err.message.includes("Access denied")) return res.status(403).json({ error: err.message });
    next(err);
  }
});

// GET /:id (Direct fetch) - Mounted at /api/tasks
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    // Avoid matching "tasks" literal if routing is weird, validates objectId usually
    const task = await Task.findById(id).populate("assignees", "name email");
    if (!task || task.deletedAt) return res.status(404).json({ error: "Not found" });

    await checkAccess(req, task.projectId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /:id (Update)
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task || task.deletedAt) return res.status(404).json({ error: "Not found" });

    const { org } = await checkAccess(req, task.projectId);

    Object.assign(task, req.body);
    task._modifiedBy = req.user._id;
    await task.save();

    await AuditLog.create({
      organizationId: org._id,
      projectId: task.projectId,
      actor: req.user._id,
      action: "task.updated",
      meta: { taskId: id, updates: Object.keys(req.body) }
    });

    ioRef?.to(`project:${task.projectId}`).emit("task:updated", { task });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /:id
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Not found" });

    const { org } = await checkAccess(req, task.projectId);

    task.deletedAt = new Date();
    task._modifiedBy = req.user._id;
    await task.save();

    await AuditLog.create({
      organizationId: org._id,
      projectId: task.projectId,
      actor: req.user._id,
      action: "task.deleted",
      meta: { taskId: id }
    });

    ioRef?.to(`project:${task.projectId}`).emit("task:deleted", { taskId: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

import { getTaskComments, createComment } from "../controllers/commentController.js";
// Comments
router.get("/:taskId/comments", requireAuth, getTaskComments);
router.post("/:taskId/comments", requireAuth, createComment);

// Audit Log
router.get("/:taskId/audit-log", requireAuth, async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const logs = await AuditLog.find({ "meta.taskId": taskId })
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
