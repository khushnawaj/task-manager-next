import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Organization from "../models/Organization.js";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// requireAuth - validates access token present in Authorization header
export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing auth" });

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, ACCESS_SECRET);

    req.user = await User.findById(payload.sub).select(
      "-passwordHash -refreshTokens"
    );

    if (!req.user) return res.status(401).json({ error: "User not found" });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireOrgRole(requiredRole) {
  return async (req, res, next) => {
    try {
      const orgId =
        req.params.organizationId ||
        req.body.organizationId ||
        req.query.organizationId;

      if (!orgId) {
        return res.status(400).json({ error: "Organization context required" });
      }

      const org = await Organization.findById(orgId);
      if (!org) return res.status(404).json({ error: "Organization not found" });

      const member = org.members.find(
        (m) => m.userId.toString() === req.user._id.toString()
      );

      if (!member)
        return res.status(403).json({ error: "Not a member of this organization" });

      const roleHierarchy = { member: 1, manager: 2, admin: 3 };

      if (roleHierarchy[member.role] < roleHierarchy[requiredRole]) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      req.organization = org;
      req.memberRole = member.role;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Authorization check failed" });
    }
  };
}

// socket auth helper
export async function verifySocketToken(token) {
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    return await User.findById(payload.sub).select(
      "-passwordHash -refreshTokens"
    );
  } catch {
    return null;
  }
}
