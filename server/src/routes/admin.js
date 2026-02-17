import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Project from "../models/Project.js";

const router = express.Router();

// Middleware to ensure admin role
const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Admin access required" });
        }
        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Admin check failed" });
    }
};

// GET /api/admin/stats
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const orgCount = await Organization.countDocuments();
        const projectCount = await Project.countDocuments();

        // Recent users (limit 5)
        const recentUsers = await User.find()
            .select("-passwordHash -refreshTokens")
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent orgs (limit 5)
        const recentOrgs = await Organization.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: { userCount, orgCount, projectCount },
            recentUsers,
            recentOrgs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
});

// GET /api/admin/users
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash -refreshTokens")
            .sort({ createdAt: -1 })
            .limit(50); // limit for now
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

export default router;
