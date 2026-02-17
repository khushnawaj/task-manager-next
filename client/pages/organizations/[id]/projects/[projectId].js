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
    Layout as LayoutIcon, Kanban, List, Clock, User, BarChart2, Shield, Search, Filter, Settings, ChevronRight
} from 'lucide-react';
import TaskDetailsModal from '../../../../components/TaskDetailsModal';
import TaskListView from '../../../../components/TaskListView';
import ProjectDashboard from '../../../../components/ProjectDashboard';
import WorkloadDashboard from '../../../../components/WorkloadDashboard';
import { motion } from 'framer-motion';
import {
    PRIORITY_COLORS,
    TYPE_ICONS,
    formatDate,
    isOverdue
} from '../../../../utils/taskUtils';

// --- Components ---

const TaskColumn = ({ title, status, tasks, onTaskClick, children }) => {
    return (
        <div className="flex-1 min-w-[320px] max-w-[360px] flex flex-col h-full bg-zinc-900/30 rounded-2xl border border-border/50 backdrop-blur-sm">
            {/* Column Header */}
            <div className="flex justify-between items-center px-4 py-3 sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md rounded-t-2xl border-b border-border/50">
                <div className="flex items-center gap-2.5">
                    <h3 className="font-semibold text-zinc-400 text-[11px] tracking-[0.1em] uppercase">{title}</h3>
                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-md font-semibold tabular-nums border border-white/5">{tasks.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="text-zinc-600 hover:text-zinc-400 p-1 rounded-md hover:bg-zinc-800 transition-all">
                        <Plus size={14} />
                    </button>
                    <button className="text-zinc-600 hover:text-zinc-400 p-1 rounded-md hover:bg-zinc-800 transition-all">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            <div className="p-3 flex-1 flex flex-col overflow-hidden">
                {children}

                <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 overflow-y-auto custom-scrollbar space-y-3 transition-colors duration-200 p-1 rounded-xl ${snapshot.isDraggingOver ? 'bg-brand-500/5' : ''}`}
                        >
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => onTaskClick(task)}
                                            className={`group bg-zinc-900 border border-border rounded-xl p-4 transition-all duration-200 cursor-pointer 
                                                ${snapshot.isDragging ? 'shadow-premium-xl scale-[1.03] border-brand-500/50 rotate-1 bg-zinc-800' : 'hover:border-zinc-700 hover:bg-zinc-900/80 shadow-premium-sm'}
                                            `}
                                            style={provided.draggableProps.style}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-zinc-500 group-hover:text-brand-400 transition-colors">
                                                        {TYPE_ICONS[task.type || 'task']}
                                                    </div>
                                                    <span className="text-[9px] text-zinc-600 font-mono group-hover:text-zinc-500 uppercase tracking-tighter">#{task._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                                {task.priority && (
                                                    <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-success'
                                                        }`} />
                                                )}
                                            </div>

                                            <h4 className="font-semibold text-zinc-100 text-sm leading-snug mb-3 group-hover:text-white transition-colors tracking-tight line-clamp-2">{task.title}</h4>

                                            {/* Subtasks Progress */}
                                            {task.subtasks && task.subtasks.length > 0 && (
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-600">
                                                        <span>Progress</span>
                                                        <span>{Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                                                            className="h-full bg-brand-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Card Footer */}
                                            <div className="flex justify-between items-center mt-auto pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-2.5">
                                                    {task.dueDate && (
                                                        <div className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue(task.dueDate) && status !== 'done' ? 'text-rose-500' : 'text-zinc-500'}`}>
                                                            <Clock size={12} strokeWidth={2.5} />
                                                            {formatDate(task.dueDate).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex -space-x-1">
                                                    {(task.assignees || []).slice(0, 2).map((u, i) => (
                                                        <div key={i} title={u.name} className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-950 flex items-center justify-center text-[8px] font-semibold shadow-sm">
                                                            {u.name?.[0]?.toUpperCase()}
                                                        </div>
                                                    ))}
                                                    {(!task.assignees || task.assignees.length === 0) && (
                                                        <div className="w-5 h-5 rounded-md border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700">
                                                            <UserIcon size={10} />
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

    const [viewMode, setViewMode] = useState('board');

    const { data: orgData } = useGetOrganizationQuery(organizationId, { skip: !organizationId || !user });
    const members = orgData?.organization?.members || [];

    useSocket(projectId);

    const { data: tasks = [], isLoading } = useGetProjectTasksQuery(projectId, { skip: !projectId || !user });
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

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
            toast.success("Task Created");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (taskId) => {
        if (confirm("Delete this task?")) {
            deleteTask(taskId);
            setSelectedTask(null);
            toast.success("Task Deleted");
        }
    };

    const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        inprogress: tasks.filter(t => t.status === 'inprogress'),
        review: tasks.filter(t => t.status === 'review'),
        done: tasks.filter(t => t.status === 'done'),
    };

    if (!user || !enabled) return null;

    return (
        <Layout title="Project Board">
            <div className="flex flex-col h-[calc(100vh-140px)]">
                {/* Board Toolbar */}
                {/* Board Toolbar */}
                <header className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 xl:gap-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <Link href={`/organizations/${organizationId}`} className="p-2 hover:bg-zinc-900 border border-border rounded-xl text-zinc-500 hover:text-white transition-all">
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="h-8 w-[1px] bg-zinc-800" />
                        <div>
                            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-zinc-600 mb-1">
                                <span>Projects</span> <ChevronRight size={10} /> <span>Development</span>
                            </div>
                            <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Project Board</h2>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                        <div className="flex items-center bg-zinc-900 border border-border p-1 rounded-xl shadow-inner overflow-x-auto max-w-full custom-scrollbar">
                            {[
                                { id: 'board', icon: Kanban, label: 'Board' },
                                { id: 'list', icon: List, label: 'List' },
                                { id: 'dashboard', icon: BarChart2, label: 'Analytics' },
                                { id: 'workload', icon: UserIcon, label: 'Team' },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setViewMode(mode.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-medium whitespace-nowrap ${viewMode === mode.id
                                        ? 'bg-zinc-800 text-zinc-100 shadow-premium-sm border border-white/5'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    <mode.icon size={14} />
                                    <span>{mode.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="hidden sm:block h-6 w-[1px] bg-zinc-800 mx-1" />

                        <div className="flex items-center gap-2 w-full sm:w-auto ml-auto sm:ml-0">
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <Search size={18} />
                            </button>
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button onClick={() => document.getElementById('new-task-input')?.focus()} className="btn-primary h-9 flex-1 sm:flex-none justify-center">
                                <Plus size={16} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Add Task</span>
                                <span className="sm:hidden">New Task</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden">
                    {viewMode === 'board' ? (
                        <div className="overflow-x-auto h-full pb-6 custom-scrollbar">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="flex gap-4 h-full min-w-max pr-6">
                                    <TaskColumn title="To Do" status="todo" tasks={columns.todo} onTaskClick={setSelectedTask}>
                                        <form onSubmit={handleCreate} className="mb-3">
                                            <div className="relative group">
                                                <input
                                                    id="new-task-input"
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    placeholder="+ Create task..."
                                                    className="w-full bg-zinc-900/50 border border-border rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:bg-zinc-900 transition-all"
                                                />
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
                        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                            <TaskListView tasks={tasks} onTaskClick={setSelectedTask} />
                        </div>
                    ) : viewMode === 'workload' ? (
                        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                            <WorkloadDashboard tasks={tasks} members={members} />
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                            <ProjectDashboard tasks={tasks} />
                        </div>
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

export async function getServerSideProps() {
    return { props: {} };
}
