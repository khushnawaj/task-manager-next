import express from "express";
import { requireAuth, requireOrgRole } from "../middleware/auth.js";
import Project from "../models/Project.js";
import AuditLog from "../models/AuditLog.js";
const router = express.Router();

// Imports already handled above
// const router = express.Router(); // Removed duplicate

// Get Projects for an Organization (User must be member of Org and Project)
router.get("/", requireAuth, requireOrgRole("member"), async (req, res) => {
  try {
    const projects = await Project.find({ 
      organizationId: req.organization._id,
      members: req.user._id 
    }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Create Project in Organization
router.post("/", requireAuth, requireOrgRole("admin"), async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;
    
    // Check Quota
    if (req.organization.plan === 'free') {
        const count = await Project.countDocuments({ organizationId: req.organization._id });
        if (count >= 3) {
            return res.status(403).json({ error: "Free plan limit reached (3 Projects). Upgrade to Pro." });
        }
    }
    
    // Ensure creator is a member
    if (!members.includes(req.user._id.toString())) {
        members.push(req.user._id);
    }

    const p = await Project.create({ 
      name, 
      description, 
      organizationId: req.organization._id,
      members 
    });

    await AuditLog.create({ 
      organizationId: req.organization._id,
      projectId: p._id, 
      actor: req.user._id, 
      action: "project.created", 
      meta: { name } 
    });
    
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
