import User from "../models/User.js";

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
