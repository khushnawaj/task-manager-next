import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { useGetProjectTasksQuery, useCreateTaskMutation } from "../../store/services/tasksApi";
import TaskCard from "../../components/TaskCard";
import CreateTaskModal from "../../components/CreateTaskModal";
import useSocket from "../../hooks/useSocket";
import { useState } from "react";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: tasks = [], isLoading } = useGetProjectTasksQuery(id, { skip: !id });
  const [createTask] = useCreateTaskMutation();
  useSocket(id);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl mb-4">Project {id}</h2>
        <button className="bg-green-600 text-white px-3 py-1 rounded mb-4" onClick={() => setOpen(true)}>New Task</button>
        {isLoading ? <div>Loading...</div> : tasks.map(t => <TaskCard key={t._id} task={t} />)}
      </div>
      {open && <CreateTaskModal projectId={id} createTask={createTask} onCreated={() => setOpen(false)} onClose={() => setOpen(false)} />}
    </>
  );
}

// Enable SSR for authenticated routes
export async function getServerSideProps() {
  return { props: {} };
}
