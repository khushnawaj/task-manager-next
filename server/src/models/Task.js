import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["backlog", "todo", "inprogress", "review", "qa", "done"], default: "todo", index: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
  priority: { type: String, enum: ["critical", "high", "medium", "low"], default: "medium", index: true },
  type: { type: String, enum: ["task", "bug", "story", "epic"], default: "task" },
  points: { type: Number },
  tags: [{ type: String }],
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  dueDate: { type: Date, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  history: [{ ts: Date, op: String, by: mongoose.Schema.Types.ObjectId, delta: Object }],
  deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

// Simple pre-save middleware to push history when modified
TaskSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.history = this.history || [];
    this.history.push({ ts: new Date(), op: "modify", by: this._modifiedBy || this.createdBy, delta: {} });
    // _modifiedBy is set by controllers when we want to record actor
  }
  next();
});

export default mongoose.model("Task", TaskSchema);
