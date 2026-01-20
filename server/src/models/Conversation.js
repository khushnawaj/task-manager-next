import mongoose from "mongoose";

const ConvSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    ts: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Conversation", ConvSchema);
