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
        const { name, email, bio, title, avatarUrl } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (title !== undefined) updates.title = title;
        if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

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

        // 3. (Removed Global Activity from here to separate endpoint)

        res.json({
            stats: {
                activeProjects: activeProjectCount,
                tasksCompleted: completedTasksCount,
                dueSoon: dueSoonCount,
                urgentIssues: urgentCount,
                velocity: "+12%"
            }
        });
    } catch (err) {
        console.error("Dashboard Data Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};

// Get Paginated Recent Activity
export const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const userOrgs = await Organization.find({ "members.userId": userId }).select('_id');
        const orgIds = userOrgs.map(o => o._id);

        const query = { organizationId: { $in: orgIds } };

        const [activity, total] = await Promise.all([
            AuditLog.find(query)
                .populate('actor', 'name email avatarUrl')
                .populate('projectId', 'name key')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AuditLog.countDocuments(query)
        ]);

        res.json({
            activity,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error("Activity Error:", err);
        res.status(500).json({ error: "Failed to fetch activity" });
    }
};

