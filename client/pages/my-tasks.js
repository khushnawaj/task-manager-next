import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useGetMyTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/services/tasksApi';
import TaskListView from '../components/TaskListView';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyTasks() {
    const { user } = useSelector(state => state.auth);
    const router = useRouter();

    const { data: tasks = [], isLoading, error } = useGetMyTasksQuery(undefined, {
        pollingInterval: 30000, // Poll every 30s for updates
        skip: !user
    });

    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user, router]);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                        <CheckSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                        <p className="text-sm text-gray-500">Tasks assigned to you across all projects</p>
                    </div>
                </div>

                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            Failed to load tasks.
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-24">
                            <h3 className="text-lg font-medium text-gray-900">No tasks assigned to you</h3>
                            <p className="text-gray-500 mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <TaskListView
                                tasks={tasks}
                                onTaskClick={setSelectedTask}
                                showProject={true}
                            />
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
