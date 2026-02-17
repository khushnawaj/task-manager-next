import Organization from "../models/Organization.js";

// Get Organization (Populated)
export const getOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id)
      .populate("members.userId", "name email avatarUrl");

    if (!org) return res.status(404).json({ error: "Organization not found" });

    // Ensure user is member
    const isMember = org.members.some(m => m.userId?._id.toString() === req.user._id.toString());
    if (!isMember && req.user.role !== "admin") { // System admin can view too?
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ organization: org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
};

// Update Member Role
export const updateMemberRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const orgId = req.params.id; // From URL ideally
    // Middleware verified caller is manager/admin of ORG

    const org = await Organization.findById(orgId);
    const member = org.members.find(m => m.userId.toString() === userId);

    if (!member) return res.status(404).json({ error: "Member not found" });

    // Prevent changing own role to less than needed? Or removing last admin?
    // Basic implementation:
    member.role = role;
    await org.save();

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

// Remove Member
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const orgId = req.params.id;

    const org = await Organization.findById(orgId);
    org.members = org.members.filter(m => m.userId.toString() !== userId);
    await org.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// Get user's Organizations
export const getMyOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find({ "members.userId": req.user._id })
      .populate("members.userId", "name email avatarUrl")
      .select("name slug plan members")
      .sort({ updatedAt: -1 });

    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
};
