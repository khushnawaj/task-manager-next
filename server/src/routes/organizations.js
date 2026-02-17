import express from "express";
import { requireAuth, requireOrgRole } from "../middleware/auth.js";
import { getOrganization, updateMemberRole, removeMember } from "../controllers/organizationController.js";

const router = express.Router();

router.get("/:id", requireAuth, getOrganization);

// Manage Roles (Manager+)
// Note: requireOrgRole looks at params.organizationId or body.organizationId. 
// We are using :id in URL. We need to map it or middleware update.
// Middleware says: req.params.organizationId
// So route should be `/:organizationId/members`?
// Or we just rely on Controller to verify since getOrganization is simple.
// But for Mutations, we need strict check.

// Let's use specific middleware wrapper or manual check in controller for simplicity now,
// OR update route param name to match middleware expectation.
router.put("/:organizationId/members/role", requireAuth, requireOrgRole("manager"), updateMemberRole);
router.delete("/:organizationId/members", requireAuth, requireOrgRole("manager"), removeMember);

export default router;
