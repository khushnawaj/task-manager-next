import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  bio: { type: String, maxlength: 500 },
  title: { type: String, maxlength: 100 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshTokens: [{ token: String, createdAt: Date }]
}, { timestamps: true });

// Index for common user lookup
UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);
