import { PRIORITY_COLORS, STATUS_COLORS, TYPE_ICONS, formatDate, isOverdue } from '../utils/taskUtils';

export default function TaskListView({ tasks, onTaskClick, showProject = false }) {
    return (
        <div className="bg-white border border-brand-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-brand-200">
                <thead className="bg-brand-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">ID</th>
                        {showProject && <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Project</th>}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Assignee</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider">Due Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-100">
                    {tasks.map((task) => (
                        <tr
                            key={task._id}
                            onClick={() => onTaskClick(task)}
                            className="hover:bg-brand-50/50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-400 font-mono">
                                #{task._id.slice(-4)}
                            </td>
                            {showProject && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900 font-medium">
                                    {task.projectId?.name || 'Unknown'} <span className="text-gray-400 font-normal text-xs">({task.projectId?.key})</span>
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="mr-2">{TYPE_ICONS[task.type || 'task']}</div>
                                    <div className="text-sm font-medium text-brand-900">{task.title}</div>
                                </div>
                                <div className="flex gap-1 mt-1">
                                    {task.tags && task.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800'} capitalize`}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${PRIORITY_COLORS[task.priority] || 'bg-gray-100'} capitalize`}>
                                    {task.priority || 'Medium'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex -space-x-2">
                                    {(task.assignees || []).map((u, i) => (
                                        <div key={i} title={u.name} className="w-6 h-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-[10px] text-brand-600 font-bold">
                                            {u.name?.[0]}
                                        </div>
                                    ))}
                                    {(!task.assignees || task.assignees.length === 0) && '-'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {task.dueDate ? (
                                    <span className={isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-600 font-bold' : ''}>
                                        {formatDate(task.dueDate)}
                                    </span>
                                ) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
