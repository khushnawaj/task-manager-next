import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Organization from "../models/Organization.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
    const { q } = req.query;

    if (!q || q.length < 2) {
        return res.json({ projects: [], tasks: [] });
    }

    try {
        // Find organizations user is part of to restrict search
        const organizations = await Organization.find({ "members.userId": req.user._id }).select("_id");
        const orgIds = organizations.map(o => o._id);

        // Search Projects
        const projects = await Project.find({
            organizationId: { $in: orgIds },
            $or: [
                { name: { $regex: q, $options: "i" } },
                { key: { $regex: q, $options: "i" } }
            ]
        }).limit(5).select("name key organizationId");

        // Search Tasks
        const tasks = await Task.find({
            organizationId: { $in: orgIds },
            $or: [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        }).limit(10).populate("projectId", "name key").select("name status priority projectId");

        res.json({ projects, tasks });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
});

export default router;
