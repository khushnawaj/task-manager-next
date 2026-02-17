import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server as IOServer } from "socket.io";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import organizationRoutes from "./routes/organizations.js";
import projectRoutes from "./routes/projects.js";
import aiRoutes from "./routes/ai.js";
import billingRoutes from "./routes/billing.js";
import taskRoutes from "./routes/tasks.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import invitationRoutes from "./routes/invitations.js";
import searchRoutes from "./routes/search.js";
import notificationRoutes from "./routes/notifications.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for SPA usage
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes); // Support /api/projects/:projectId/tasks
app.use("/api/tasks", taskRoutes);    // Support /api/tasks/:id
app.use("/api/ai", aiRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Mongo connected");
    const io = new IOServer(server, {
      cors: { origin: CLIENT_ORIGIN, credentials: true }
    });

    server.listen(PORT, () => console.log(`Server listening ${PORT}`));
  })
  .catch(err => {
    console.error("DB connect error", err);
    process.exit(1);
  });
