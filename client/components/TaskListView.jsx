import { PRIORITY_COLORS, STATUS_COLORS, TYPE_ICONS, formatDate, isOverdue } from '../utils/taskUtils';
import { Clock, Hash, ChevronRight, MoreHorizontal, User } from 'lucide-react';

export default function TaskListView({ tasks, onTaskClick, showProject = false }) {
    return (
        <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-zinc-950/50">
                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <div className="flex items-center gap-2">ID</div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Task
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Priority
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Assignee
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Due Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tasks.map((task) => (
                            <tr
                                key={task._id}
                                onClick={() => onTaskClick(task)}
                                className="group hover:bg-zinc-800/30 cursor-pointer transition-all duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-mono font-bold text-zinc-600 group-hover:text-zinc-500">
                                    {task._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-zinc-600 group-hover:text-brand-400 transition-colors shrink-0">
                                            {TYPE_ICONS[task.type || 'task']}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-tight">
                                                {task.title}
                                            </span>
                                            {showProject && (
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                                                    {task.projectId?.name || 'Project'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' :
                                                task.status === 'review' ? 'bg-indigo-500' :
                                                    task.status === 'inprogress' ? 'bg-brand-500' : 'bg-zinc-700'
                                            }`} />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {task.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md border ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-zinc-800 text-zinc-500 border-white/5'
                                            }`}>
                                            {task.priority || 'Medium'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex -space-x-1.5">
                                        {(task.assignees || []).map((u, i) => (
                                            <div key={i} title={u.name} className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-950 flex items-center justify-center text-[9px] font-bold shadow-sm transition-transform group-hover:scale-110">
                                                {u.name?.[0]?.toUpperCase()}
                                            </div>
                                        ))}
                                        {(!task.assignees || task.assignees.length === 0) && (
                                            <div className="w-6 h-6 rounded-md border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700">
                                                <User size={12} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {task.dueDate ? (
                                        <div className={`flex items-center justify-end gap-1.5 text-[11px] font-mono font-bold ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-rose-500' : 'text-zinc-500'}`}>
                                            <Clock size={12} />
                                            {formatDate(task.dueDate).toUpperCase()}
                                        </div>
                                    ) : (
                                        <span className="text-zinc-700">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {tasks.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-zinc-600 text-sm font-medium">No tasks found in this view.</p>
                </div>
            )}
        </div>
    );
}
