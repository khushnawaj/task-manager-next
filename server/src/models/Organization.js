import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["admin", "manager", "member"], default: "member" },
    joinedAt: { type: Date, default: Date.now }
  }],
  plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  subscriptionStatus: { type: String, enum: ["active", "fast_due", "canceled", "incomplete"], default: "active" },
  stripeCustomerId: { type: String },
  subscriptionEndsAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Organization", OrganizationSchema);
