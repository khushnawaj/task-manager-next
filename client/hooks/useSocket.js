import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { tasksApi } from "../store/services/tasksApi";

export default function useSocket(projectId) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const sockRef = useRef(null);

  useEffect(() => {
    if (!projectId || !token) return;

    // Connect
    const socket = io(process.env.NEXT_PUBLIC_SOCKET || "http://localhost:4000", {
      auth: { token },
      transports: ['websocket']
    });
    sockRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected to project:", projectId);
      // Join Room
      socket.emit("joinProject", { projectId });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Handle Create
    socket.on("task:created", ({ task }) => {
      dispatch(tasksApi.util.updateQueryData("getProjectTasks", projectId, (draft) => {
        // Prevent duplicates
        if (!draft.some(t => t._id === task._id)) {
          draft.unshift(task);
        }
      }));
    });

    // Handle Update & Assign
    const handleUpdate = ({ task }) => {
      dispatch(tasksApi.util.updateQueryData("getProjectTasks", projectId, (draft) => {
        const idx = draft.findIndex(t => t._id === task._id);
        if (idx !== -1) {
          // Keep keys that might be missing in partial update if necessary, 
          // but usually backend sends full task on update.
          draft[idx] = { ...draft[idx], ...task };
        }
      }));
    };

    socket.on("task:updated", handleUpdate);
    socket.on("task:assigned", handleUpdate);

    // Handle Delete
    socket.on("task:deleted", ({ taskId }) => {
      dispatch(tasksApi.util.updateQueryData("getProjectTasks", projectId, (draft) => {
        const idx = draft.findIndex(t => t._id === taskId);
        if (idx !== -1) draft.splice(idx, 1);
      }));
    });

    return () => {
      socket.emit("leaveProject", { projectId });
      socket.disconnect();
    };
  }, [projectId, token, dispatch]);

  return sockRef;
}
