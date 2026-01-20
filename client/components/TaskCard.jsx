export default function TaskCard({ task }) {
  return (
    <div className="border p-3 rounded shadow-sm mb-2">
      <div className="font-semibold">{task.title}</div>
      <div className="text-xs text-gray-500">{task.status} • due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</div>
      <div className="mt-2 text-sm">{task.description}</div>
    </div>
  );
}
