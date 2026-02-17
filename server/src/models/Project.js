import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  key: { type: String, required: true, uppercase: true, trim: true },
  description: String,
  status: { type: String, enum: ["planning", "active", "on_hold", "archived", "completed"], default: "planning" },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  icon: String,
  meta: Object
}, { timestamps: true });

// Compound index for unique key within organization
ProjectSchema.index({ organizationId: 1, key: 1 }, { unique: true });

ProjectSchema.index({ name: "text" });

export default mongoose.model("Project", ProjectSchema);
