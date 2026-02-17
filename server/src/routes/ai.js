import express from "express";
import { requireAuth, requireOrgRole } from "../middleware/auth.js";
import { aiService } from "../services/aiService.js";
const router = express.Router();

// Middleware to check AI Access
const requirePro = async (req, res, next) => {
    try {
        const { organizationId, projectId } = req.body;

        let orgId = organizationId;

        if (!orgId && projectId) {
            // Use the Project model to find the organization
            const Project = (await import("../models/Project.js")).default;
            const project = await Project.findById(projectId);
            if (project) {
                orgId = project.organizationId;
            }
        }

        if (!orgId) {
            // Fallback: If we can't determine Org, we might allow (or block).
            // For security, let's block if we can't verify plan.
            return res.status(400).json({ error: "Context (organizationId or projectId) required for AI features." });
        }

        const Organization = (await import("../models/Organization.js")).default;
        const org = await Organization.findById(orgId);

        if (!org || org.plan === 'free') {
            return res.status(403).json({ error: "AI features are available on Pro Plan only." });
        }

        // Attach org for downstream use if needed
        req.organization = org;
        next();
    } catch (err) {
        console.error("AI Access Check Error:", err);
        return res.status(500).json({ error: "Failed to verify AI subscription access." });
    }
};


router.post("/summarize", requireAuth, requirePro, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    try {
        const result = await aiService.generate(`Summarize the following text concisely:\n\n${text}`);
        res.json({ summary: result.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Summarization failed" });
    }
});

router.post("/generate-tasks", requireAuth, async (req, res) => {
    const { goal, projectId } = req.body;
    if (!goal || !projectId) return res.status(400).json({ error: "Goal and ProjectID required" });

    // Check Plan (Simplified Inline)
    try {
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

    try {
        const tasks = await aiService.generateJSON(prompt);
        if (!Array.isArray(tasks)) {
            return res.status(500).json({ error: "AI failed to generate valid tasks" });
        }
        res.json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI Generation failed" });
    }
});

export default router;
