import express from "express";
import crypto from "crypto";
import { requireAuth, requireOrgRole } from "../middleware/auth.js";
import Invitation from "../models/Invitation.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js"; // For accepting

const router = express.Router();

// Create Invitation (Admin/Manager only)
router.post("/invite", requireAuth, requireOrgRole("manager"), async (req, res) => {
    try {
        const { email, role, organizationId } = req.body;
        // Check if user already member?
        const org = req.organization; // populated by middleware

        // Ensure inviter has higher role if trying to invite admin? (Optional complexity)

        const token = crypto.randomBytes(20).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const invite = await Invitation.create({
            email,
            role,
            organizationId,
            invitedBy: req.user._id,
            token,
            expiresAt
        });

        // In real app: Send Email
        // Here: Return link
        const link = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/invite/${token}`;

        res.json({ message: "Invitation created", link, token });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: "Already invited this email" });
        console.error(err);
        res.status(500).json({ error: "Invite failed" });
    }
});

// Get Pending Invites
router.get("/pending", requireAuth, requireOrgRole("manager"), async (req, res) => {
    try {
        const invites = await Invitation.find({
            organizationId: req.query.organizationId,
            status: "pending"
        });
        res.json({ invites });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invites" });
    }
});

// Accept Invitation (Public or Auth?)
// If user has account -> Login then accept.
// If no account -> Signup with token.
// Let's make an endpoint to Validate Token details
router.get("/validate/:token", async (req, res) => {
    try {
        const invite = await Invitation.findOne({ token: req.params.token, status: "pending" }).populate("organizationId", "name");
        if (!invite) return res.status(404).json({ valid: false, error: "Invalid or expired invite" });
        if (new Date() > invite.expiresAt) {
            invite.status = "expired";
            await invite.save();
            return res.status(400).json({ valid: false, error: "Expired invite" });
        }
        res.json({ valid: true, email: invite.email, orgName: invite.organizationId.name, role: invite.role });
    } catch (err) {
        res.status(500).json({ error: "Validation error" });
    }
});

// Accept (Must be logged in)
router.post("/accept", requireAuth, async (req, res) => {
    try {
        const { token } = req.body;
        const invite = await Invitation.findOne({ token, status: "pending" });
        if (!invite) return res.status(400).json({ error: "Invalid invite" });

        // Add to Org
        const org = await Organization.findById(invite.organizationId);

        // check duplicacy
        const exists = org.members.find(m => m.userId.toString() === req.user._id.toString());
        if (!exists) {
            org.members.push({ userId: req.user._id, role: invite.role });
            await org.save();
        }

        invite.status = "accepted";
        await invite.save();

        res.json({ success: true, organizationId: org._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to accept invite" });
    }
});

export default router;
