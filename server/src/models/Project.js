import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  meta: Object
}, { timestamps: true });

ProjectSchema.index({ name: "text" });

export default mongoose.model("Project", ProjectSchema);
