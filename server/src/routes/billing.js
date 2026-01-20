import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getSubscriptionStatus, createCheckoutSession } from "../controllers/billingController.js";

const router = express.Router();

router.get("/status", requireAuth, getSubscriptionStatus);
router.post("/checkout", requireAuth, createCheckoutSession);

export default router;
