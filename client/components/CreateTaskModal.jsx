import { useState } from "react";

export default function CreateTaskModal({ projectId, onCreated, onClose, createTask }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 w-96 rounded">
        <h3 className="font-bold mb-2">Create Task</h3>
        <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="border p-2 w-full mb-2" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input type="date" className="border p-2 w-full mb-2" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-3 py-1" onClick={async () => {
            if (!title) return alert("title required");
            const payload = { projectId, title, description: desc, dueDate };
            await createTask(payload).unwrap();
            onCreated?.();
          }}>Create</button>
        </div>
      </div>
    </div>
  );
}
