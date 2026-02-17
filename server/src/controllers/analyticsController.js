import Task from "../models/Task.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Project from "../models/Project.js";

/**
 * Controller for High-Fidelity Analytics & Productivity Metrics
 * Implements real-time intelligence for the heatmap and project velocity charts.
 */

// 📈 GET /api/analytics/heatmap
// Generates data for a contribution heatmap over the last 90 days
export const getHeatmapData = async (req, res) => {
    try {
        const userId = req.user._id;
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Fetch task completions and audit logs for the user
        const logs = await AuditLog.find({
            actor: userId,
            createdAt: { $gte: ninetyDaysAgo }
        }).select('createdAt action');

        // Group by date
        const contributionMap = {};
        logs.forEach(log => {
            const date = log.createdAt.toISOString().split('T')[0];
            contributionMap[date] = (contributionMap[date] || 0) + 1;
        });

        // Convert to array format for frontend
        const result = Object.entries(contributionMap).map(([date, count]) => ({
            date,
            count
        }));

        res.json(result);
    } catch (err) {
        console.error("Heatmap Error:", err);
        res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
};

// 📊 GET /api/analytics/velocity/:projectId
// Calculates weekly task closure velocity for a specific project
export const getProjectVelocity = async (req, res) => {
    try {
        const { projectId } = req.params;
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

        // Fetch tasks completed in the last 8 weeks
        const tasks = await Task.find({
            projectId,
            status: 'done',
            updatedAt: { $gte: eightWeeksAgo }
        }).select('updatedAt');

        // Group completions by week
        const velocityMap = {};
        tasks.forEach(task => {
            const date = new Date(task.updatedAt);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)).toISOString().split('T')[0];
            velocityMap[weekStart] = (velocityMap[weekStart] || 0) + 1;
        });

        // Ensure all last 8 weeks are represented
        const result = [];
        for (let i = 0; i < 8; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1) - (i * 7));
            const dateKey = d.toISOString().split('T')[0];
            result.unshift({
                week: dateKey,
                completed: velocityMap[dateKey] || 0
            });
        }

        res.json(result);
    } catch (err) {
        console.error("Velocity Error:", err);
        res.status(500).json({ error: "Failed to fetch velocity metrics" });
    }
};

// 💎 GET /api/analytics/burndown/:projectId
// Calculates burndown metrics (Total vs Done over time)
export const getBurndownData = async (req, res) => {
    try {
        const { projectId } = req.params;
        // Simplified burndown logic for MVP
        const tasks = await Task.find({ projectId }).select('status createdAt updatedAt');

        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'done').length;
        const pending = total - done;

        res.json({ total, done, pending });
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate burndown" });
    }
};
