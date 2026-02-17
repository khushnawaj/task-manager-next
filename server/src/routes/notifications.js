import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get user notifications
router.get("/", requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate("senderId", "name avatarUrl")
            .limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// Mark notification as read
router.patch("/:id/read", requireAuth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// Mark all as read
router.patch("/read-all", requireAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

export default router;
