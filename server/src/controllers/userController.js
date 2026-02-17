import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import AuditLog from "../models/AuditLog.js";
import Organization from "../models/Organization.js";

// Get current user profile (just in case frontend needs refresh)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-passwordHash -refreshTokens");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// Update current user profile
export const updateMe = async (req, res) => {
    try {
        const { name, email } = req.body; // Allow email update? Usually requires verify. Let's stick to name for now.

        // Only allow updating name for now for simplicity & security
        const updates = {};
        if (name) updates.name = name;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select("-passwordHash -refreshTokens");

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Profile update failed" });
    }
};

// Get Dashboard Statistics & Global Activity
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get user's organizations to filter projects & activity
        const userOrgs = await Organization.find({ "members.userId": userId }).select('_id');
        const orgIds = userOrgs.map(o => o._id);

        // 2. Statistics
        // Active Projects (across all user's organizations)
        const activeProjectCount = await Project.countDocuments({
            organizationId: { $in: orgIds },
            status: { $in: ['active', 'planning'] }
        });

        // Tasks Statistics (assigned to user)
        const userTasks = await Task.find({
            assignees: userId,
            deletedAt: null
        });

        const completedTasksCount = userTasks.filter(t => t.status === 'done').length;

        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const dueSoonCount = userTasks.filter(t =>
            t.status !== 'done' &&
            t.dueDate &&
            new Date(t.dueDate) > now &&
            new Date(t.dueDate) <= nextWeek
        ).length;

        const urgentCount = userTasks.filter(t =>
            t.status !== 'done' &&
            (t.priority === 'critical' || t.priority === 'high')
        ).length;

        // 3. Global Activity Feed (Audit logs for projects/orgs user has access to)
        // We limit to most recent 20 events globally across accessible scopes
        const recentActivity = await AuditLog.find({
            organizationId: { $in: orgIds }
        })
            .populate('actor', 'name email')
            .populate('projectId', 'name key')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            stats: {
                activeProjects: activeProjectCount,
                tasksCompleted: completedTasksCount,
                dueSoon: dueSoonCount,
                urgentIssues: urgentCount,
                // Calculated velocity/growth mock for UI
                velocity: "+12%"
            },
            recentActivity
        });
    } catch (err) {
        console.error("Dashboard Data Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};
