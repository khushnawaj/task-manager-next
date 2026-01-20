import Organization from "../models/Organization.js";

export const getSubscriptionStatus = async (req, res) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) return res.status(400).json({ error: "Organization ID required" });

    const org = await Organization.findById(organizationId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const member = org.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!member) return res.status(403).json({ error: "Access denied" });

    res.json({
      plan: org.plan || "free",
      status: org.subscriptionStatus || "active",
      endsAt: org.subscriptionEndsAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { organizationId, planId } = req.body;
    
    const org = await Organization.findById(organizationId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const member = org.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!member || member.role !== 'admin') {
        return res.status(403).json({ error: "Only admins can upgrade billing" });
    }

    if (planId === 'pro') {
        org.plan = 'pro';
        org.subscriptionStatus = 'active';
        await org.save();
    }

    res.json({
      url: `/organizations/${organizationId}/billing?success=true` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
