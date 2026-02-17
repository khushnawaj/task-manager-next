import { useRouter } from 'next/router';
import {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} from '../../../../store/services/tasksApi';
import { useGenerateTasksMutation } from '../../../../store/services/aiApi';
import { useGetOrganizationQuery } from '../../../../store/services/organizationApi';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSocket from '../../../../hooks/useSocket';
import Layout from '../../../../components/Layout';
import { toast } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Plus, User as UserIcon, MoreHorizontal, ArrowLeft,
    Layout as LayoutIcon, Kanban, List, Clock, User, BarChart2
} from 'lucide-react';
import TaskDetailsModal from '../../../../components/TaskDetailsModal';
import TaskListView from '../../../../components/TaskListView';
import ProjectDashboard from '../../../../components/ProjectDashboard';
import WorkloadDashboard from '../../../../components/WorkloadDashboard';
import {
    PRIORITY_COLORS,
    TYPE_ICONS,
    formatDate,
    isOverdue
} from '../../../../utils/taskUtils';

// --- Components ---

const TaskColumn = ({ title, status, tasks, onTaskClick, children }) => {
    return (
        <div className={`flex-1 min-w-[300px] max-w-[350px] flex flex-col h-full max-h-full rounded-xl bg-gray-50/50 border border-transparent`}>
            {/* Column Header */}
            <div className="flex justify-between items-center mb-3 px-3 py-3">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-brand-900 text-sm tracking-tight">{title}</h3>
                    <span className="bg-white border border-brand-200 text-xs px-2 py-0.5 rounded-full text-brand-500 font-medium shadow-xs">{tasks.length}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="px-3 pb-3 flex-1 flex flex-col overflow-hidden">
                {children}

                <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 overflow-y-auto pr-1 space-y-3 transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-brand-100/50' : ''}`}
                        >
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => onTaskClick(task)}
                                            className={`group bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
                                                ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-brand-200 border-brand-300 z-50' : 'border-brand-200'}
                                            `}
                                            style={provided.draggableProps.style}
                                        >
                                            {/* Minimal Header: Type & Priority (if high) */}
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    {TYPE_ICONS[task.type || 'task']}
                                                    <span className="text-xs text-gray-400 font-mono">#{task._id.slice(-4)}</span>
                                                </div>
                                                {task.priority && task.priority !== 'medium' && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${PRIORITY_COLORS[task.priority]}`}>
                                                        {task.priority}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="font-medium text-brand-900 text-sm leading-snug mb-2">{task.title}</h4>

                                            {/* Subtasks Progress */}
                                            {task.subtasks && task.subtasks.length > 0 && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-brand-400 rounded-full"
                                                            style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {task.tags && task.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {task.tags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-md">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Footer: Date & Assignee */}
                                            <div className="flex justify-between items-center mt-2 border-t border-dashed border-gray-100 pt-2">
                                                <div className="flex items-center gap-3">
                                                    {task.dueDate && (
                                                        <div className={`flex items-center gap-1 text-[10px] ${isOverdue(task.dueDate) && status !== 'done' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                            <Clock size={12} />
                                                            {formatDate(task.dueDate)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex -space-x-1">
                                                    {(task.assignees || []).map((u, i) => (
                                                        <div key={i} title={u.name} className="w-5 h-5 rounded-full bg-brand-100 border border-white flex items-center justify-center text-[9px] text-brand-600 font-bold">
                                                            {u.name?.[0]}
                                                        </div>
                                                    ))}
                                                    {(!task.assignees || task.assignees.length === 0) && (
                                                        <div className="w-5 h-5 rounded-full bg-gray-50 border border-transparent border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                                                            <UserIcon size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

export default function ProjectBoard() {
    const router = useRouter();
    const { id: organizationId, projectId } = router.query;
    const { user } = useSelector(state => state.auth);

    // View State
    const [viewMode, setViewMode] = useState('board'); // 'board' | 'list' | 'dashboard'

    // Fetch Org Data for Members List
    const { data: orgData } = useGetOrganizationQuery(organizationId, { skip: !organizationId || !user });
    const members = orgData?.organization?.members || [];

    // Realtime
    useSocket(projectId);

    const { data: tasks = [], isLoading } = useGetProjectTasksQuery(projectId, { skip: !projectId || !user });
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [generateTasks, { isLoading: isGenerating }] = useGenerateTasksMutation();

    const [selectedTask, setSelectedTask] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        if (destination.droppableId !== source.droppableId) {
            updateTask({ id: draggableId, status: destination.droppableId });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            await createTask({ projectId, title: newTaskTitle, status: 'todo' }).unwrap();
            setNewTaskTitle("");
            toast.success("Task created");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (taskId) => {
        if (confirm("Delete this task?")) {
            deleteTask(taskId);
            setSelectedTask(null);
            toast.success("Task deleted");
        }
    };

    // Derived State for columns
    const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        inprogress: tasks.filter(t => t.status === 'inprogress'),
        review: tasks.filter(t => t.status === 'review'),
        done: tasks.filter(t => t.status === 'done'),
    };

    if (!user) return null;
    if (!enabled) return null;

    return (
        <Layout title="Project Board">
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-brand-200 bg-white shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <Link href={`/organizations/${organizationId}`} className="text-brand-500 hover:text-brand-900 transition-colors flex items-center gap-2 text-sm font-medium">
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <div className="h-4 w-px bg-brand-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-brand-50 rounded-md text-brand-600 border border-brand-200">
                                <LayoutIcon size={16} />
                            </div>
                            <span className="text-brand-900 font-display font-bold tracking-tight text-lg">Work Board</span>
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Board View"
                        >
                            <Kanban size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'dashboard' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Analytics Dashboard"
                        >
                            <BarChart2 size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('workload')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'workload' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Team Workload"
                        >
                            <UserIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-hidden bg-brand-50/30">
                    {viewMode === 'board' ? (
                        <div className="overflow-x-auto h-full">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="flex gap-6 h-full min-w-max">
                                    <TaskColumn title="To Do" status="todo" tasks={columns.todo} onTaskClick={setSelectedTask}>
                                        <form onSubmit={handleCreate} className="mb-3">
                                            <div className="relative">
                                                <input
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    placeholder="Add Task..."
                                                    className="w-full bg-white border border-brand-200 rounded-md pl-3 pr-8 py-2 text-sm placeholder-brand-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-shadow"
                                                />
                                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    </TaskColumn>

                                    <TaskColumn title="In Progress" status="inprogress" tasks={columns.inprogress} onTaskClick={setSelectedTask} />

                                    <TaskColumn title="Review" status="review" tasks={columns.review} onTaskClick={setSelectedTask} />

                                    <TaskColumn title="Done" status="done" tasks={columns.done} onTaskClick={setSelectedTask} />
                                </div>
                            </DragDropContext>
                        </div>
                    ) : viewMode === 'list' ? (
                        <div className="h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">All Tasks</h3>
                                <button className="btn-primary flex items-center gap-2" onClick={() => { setNewTaskTitle("New Task"); handleCreate({ preventDefault: () => { } }); }}>
                                    <Plus size={16} /> Add Task
                                </button>
                            </div>
                            <TaskListView tasks={tasks} onTaskClick={setSelectedTask} />
                        </div>
                    ) : viewMode === 'workload' ? (
                        <WorkloadDashboard tasks={tasks} members={members} />
                    ) : (
                        <ProjectDashboard tasks={tasks} />
                    )}
                </div>
            </div>

            {/* Task Details Modal */}
            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={updateTask}
                    onDelete={() => handleDelete(selectedTask._id)}
                    members={members}
                />
            )}
        </Layout>
    );
}

// Enable SSR for authenticated routes
export async function getServerSideProps() {
    return { props: {} };
}
