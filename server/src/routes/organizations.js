import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMyOrganizations, createOrganization } from "../controllers/organizationController.js";

const router = express.Router();

router.get("/", requireAuth, getMyOrganizations);
router.post("/", requireAuth, createOrganization);

export default router;
