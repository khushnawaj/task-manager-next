import { verifySocketToken } from "./middleware/auth.js";

export let ioRef = null;

export function initSocket(io) {
  ioRef = io;

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split?.(" ")[1];
    const user = await verifySocketToken(token);
    if (!user) return next(new Error("unauthorized"));
    socket.user = { id: user._id.toString(), name: user.name, role: user.role };
    next();
  });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.user?.name);

    socket.on("joinProject", ({ projectId }) => {
      const room = `project:${projectId}`;
      socket.join(room);
    });

    socket.on("leaveProject", ({ projectId }) => {
      const room = `project:${projectId}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => { });
  });
}
