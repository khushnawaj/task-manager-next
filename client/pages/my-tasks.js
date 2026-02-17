import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useGetMyTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/services/tasksApi';
import TaskListView from '../components/TaskListView';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { CheckSquare, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyTasks() {
    const { user, initialized } = useSelector(state => state.auth);
    const router = useRouter();

    const { data: tasks = [], isLoading, error } = useGetMyTasksQuery(undefined, {
        pollingInterval: 30000, // Poll every 30s for updates
        skip: !user || !initialized
    });

    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (initialized && !user) router.push('/login');
    }, [user, initialized, router]);

    const handleDelete = (taskId) => {
        if (confirm("Delete this task?")) {
            deleteTask(taskId);
            setSelectedTask(null);
            toast.success("Task deleted");
        }
    };

    if (!user) return null;

    return (
        <Layout title="My Tasks">
            <div className="max-w-6xl mx-auto py-8 flex flex-col min-h-[calc(100vh-100px)]">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-zinc-900 border border-border rounded-xl text-brand-400 shadow-inner">
                        <CheckSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">My Tasks</h1>
                        <p className="text-sm font-medium text-zinc-500 mt-0.5">Direct assignments across all organizational units</p>
                    </div>
                </div>

                <div className="flex-1 bg-zinc-900 border border-border rounded-2xl shadow-premium-sm overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col justify-center items-center gap-4 py-24">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent"></div>
                            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Compiling task list...</p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
                                <Info size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-200">Load Failure</h3>
                            <p className="text-sm text-zinc-500 mt-1">Unable to synchronize your task repository.</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-16 h-16 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-800 mb-6">
                                <CheckSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-300">Clean Slate</h3>
                            <p className="text-sm font-medium text-zinc-500 mt-1">You have zero active assignments in the current cycle.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto custom-scrollbar">
                                <TaskListView
                                    tasks={tasks}
                                    onTaskClick={setSelectedTask}
                                    showProject={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={updateTask}
                    onDelete={() => handleDelete(selectedTask._id)}
                    members={[]} // In 'My Tasks', we don't load project members yet
                />
            )}
        </Layout>
    );
}
