import express from "express";
import { requireAuth, requireOrgRole } from "../middleware/auth.js";
import { aiService } from "../services/aiService.js";
const router = express.Router();

router.post("/summarize", requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });
  const result = await aiService.generate(`Summarize the following text concisely:\n\n${text}`);
  res.json({ summary: result.text });
});

import Organization from "../models/Organization.js";
// ... imports

// Middleware to check AI Access
const requirePro = async (req, res, next) => {
    // We need organizationId to check plan. 
    // It should be passed in body for these endpoints.
    const { organizationId, projectId } = req.body;
    let orgId = organizationId;
    
    if (!orgId && projectId) {
        // Look up via Project if only projectId sent (common)
        // Note: Ideally we'd import Project model but circular deps might happen. 
        // Let's rely on client sending both or doing lookup.
        // For now, let's just do a quick lookup helper if needed or assume client passes it.
        // To keep it robust, let's assume we can find it.
        // ... simplified for MVP:
    }
    
    // Assume client sends org context or we trust the Project look up 
    // Actually, let's rely on the previous checkAccess pattern or just look up the Organization if we have projectId.
    // However, `generate-tasks` receives `projectId`.
    // Let's skip middleware and do it inline for simplicity and robustness.
    next(); 
};

router.post("/generate-tasks", requireAuth, async (req, res) => {
    const { goal, projectId } = req.body;
    if (!goal || !projectId) return res.status(400).json({ error: "Goal and ProjectID required" });

    // Check Plan (Simplified Inline)
    // We need to find the project to get the org
    try {
        // Dynamic import to avoid top-level circular dependency if any
        const Project = (await import("../models/Project.js")).default;
        const Organization = (await import("../models/Organization.js")).default;
        
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });
        
        const org = await Organization.findById(project.organizationId);
        if (org.plan === 'free') {
            return res.status(403).json({ error: "AI features are available on Pro Plan only." });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Plan check failed" });
    }

    // Prompt Engineering
    const prompt = `
        Start by acting as a Project Manager.
        The goal is: "${goal}".
        Generate 3 to 5 actionable tasks to achieve this goal.
        Return a JSON array where each object has: "title" (string), "description" (string), "status" (enum: "todo").
        Do not explain. Just JSON.
    `;
    
    const tasks = await aiService.generateJSON(prompt);
    
    if (!Array.isArray(tasks)) {
        return res.status(500).json({ error: "AI failed to generate valid tasks" });
    }

    res.json({ tasks });
});

export default router;
