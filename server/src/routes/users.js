import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMe, updateMe, getDashboardData } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.get("/dashboard", requireAuth, getDashboardData);

export default router;
