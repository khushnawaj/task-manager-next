import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    getHeatmapData,
    getProjectVelocity,
    getBurndownData
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require authentication
router.use(requireAuth);

router.get("/heatmap", getHeatmapData);
router.get("/velocity/:projectId", getProjectVelocity);
router.get("/burndown/:projectId", getBurndownData);

export default router;
