import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
        type: String,
        enum: ["assignment", "mention", "update", "invitation", "system"],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId }, // Task ID, Project ID, etc.
    entityType: { type: String, enum: ["task", "project", "organization"] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
