import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import AuditLog from "../models/AuditLog.js";
import { ioRef } from "../socket.js";
const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { projectId, text } = req.body;
  if (!projectId || !text) return res.status(400).json({ error: "Missing fields" });
  const conv = await Conversation.findOneAndUpdate({ projectId }, { $push: { messages: { author: req.user._id, text } } }, { upsert: true, new: true });
  await AuditLog.create({ projectId, actor: req.user._id, action: "conversation.message", meta: { text: text.slice(0,200) } });
  ioRef?.to(`project:${projectId}`).emit("conversation:message", { message: conv.messages.slice(-1)[0] });
  res.json(conv);
});

export default router;
