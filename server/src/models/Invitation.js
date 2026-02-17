import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "manager", "member", "observer"], default: "member" },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["pending", "accepted", "expired"], default: "pending" }
}, { timestamps: true });

InvitationSchema.index({ email: 1, organizationId: 1 }, { unique: true }); // Prevent duplicate active invites? Maybe check status manually.

export default mongoose.model("Invitation", InvitationSchema);
