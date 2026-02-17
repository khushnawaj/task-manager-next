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
    const { name, description, key, startDate, endDate, leadId, icon, status, members = [] } = req.body;

    // Check Quota - Removed (Free Unlimited)

    // Generate Key if missing
    let projectKey = key;
    if (!projectKey) {
      projectKey = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
      if (projectKey.length < 2) projectKey = "PRJ";
      // Check uniqueness
      let suffix = 1;
      while (await Project.findOne({ organizationId: req.organization._id, key: projectKey })) {
        projectKey = `${projectKey.substring(0, 3)}${suffix++}`;
      }
    }

    // Ensure creator is a member
    if (!members.includes(req.user._id.toString())) {
      members.push(req.user._id);
    }

    const p = await Project.create({
      name,
      key: projectKey,
      description,
      startDate,
      endDate,
      leadId: leadId || req.user._id,
      icon,
      status,
      organizationId: req.organization._id,
      members
    });

    // Add Audit Log
    await AuditLog.create({
      organizationId: req.organization._id,
      projectId: p._id,
      actor: req.user._id,
      action: "project.created",
      meta: { name, key: projectKey }
    });

    res.json(p);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: "Project key or name already exists in this organization." });
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
