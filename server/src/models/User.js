import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  // role: { type: String, enum: ["admin","manager","member"], default: "member" }, // Removed for Organization-based RBAC
  refreshTokens: [{ token: String, createdAt: Date }]
}, { timestamps: true });

// Index for common user lookup
UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);
