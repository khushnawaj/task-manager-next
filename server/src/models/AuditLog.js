import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String },
  meta: { type: Object }
}, { timestamps: true });

AuditSchema.index({ organizationId: 1, projectId: 1, createdAt: -1 });

export default mongoose.model("AuditLog", AuditSchema);
