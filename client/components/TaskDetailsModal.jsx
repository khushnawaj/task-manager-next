import { useState } from 'react';
import { useGetTaskCommentsQuery, useAddCommentMutation, useGetTaskAuditLogQuery } from '../store/services/tasksApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, BookOpen, MessageSquare, Send, Tag, Activity, List, CheckSquare, Square, Check, Clock } from 'lucide-react';
import { PRIORITY_COLORS, TYPE_ICONS, formatDateTime } from '../utils/taskUtils';
import { useSelector } from 'react-redux';

export default function TaskDetailsModal({ task, onClose, onUpdate, onDelete, members = [] }) {
    // Normalize assignees: if populated objects, map to IDs.
    const [formData, setFormData] = useState({
        ...task,
        assignees: task.assignees?.map(a => typeof a === 'object' ? a._id : a) || [],
        tags: task.tags?.join(', ') || '',
        subtasks: task.subtasks || []
    });
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'subtasks' | 'activity'

    // Comments Logic
    const { data: comments = [], isLoading: commentsLoading } = useGetTaskCommentsQuery(task._id);
    const [addComment] = useAddCommentMutation();
    const [newComment, setNewComment] = useState("");

    // Audit Log Logic
    const { data: auditLogs = [], isLoading: auditLoading } = useGetTaskAuditLogQuery(task._id);

    // Subtask Logic
    const [newSubtask, setNewSubtask] = useState("");

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
        onUpdate({
            id: task._id,
            ...formData,
            tags: tagsArray
        });
        toast.success("Task updated successfully");
        onClose();
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await addComment({ taskId: task._id, text: newComment }).unwrap();
            setNewComment("");
            toast.success("Comment added");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add comment");
        }
    };

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        const newSubtaskObj = { title: newSubtask, completed: false };
        setFormData(prev => ({
            ...prev,
            subtasks: [...(prev.subtasks || []), newSubtaskObj]
        }));
        setNewSubtask("");
    };

    const toggleSubtask = (index) => {
        const updatedSubtasks = [...(formData.subtasks || [])];
        if (updatedSubtasks[index]) {
            updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
            setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
        }
    };

    const removeSubtask = (index) => {
        const updatedSubtasks = (formData.subtasks || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subtasks: updatedSubtasks }));
    };

    // Helper to get display name for assignee
    const getAssigneeName = () => {
        if (!task.assignees || task.assignees.length === 0) return 'Unassigned';
        const a = task.assignees[0];
        if (typeof a === 'object') return a.name;
        return 'Unknown';
    };

    const getAssigneeInitial = () => {
        if (!task.assignees || task.assignees.length === 0) return '?';
        const a = task.assignees[0];
        if (typeof a === 'object') return a.name?.[0];
        return '?';
    };

    // Construct Activity Timeline
    const timeline = [
        ...comments.map(c => ({ ...c, type: 'comment', timestamp: c.createdAt })),
        ...auditLogs.map(l => ({ ...l, type: 'audit', timestamp: l.createdAt }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full h-[85vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="uppercase text-xs font-bold text-gray-500 tracking-wider border px-2 py-0.5 rounded bg-white shadow-sm flex items-center gap-1">
                                    {TYPE_ICONS[formData.type || 'task']} {formData.type || 'Task'}
                                </span>
                                <span className="text-gray-400 text-sm font-mono">#{task._id.slice(-4)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete Task">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                            {/* Left: Task Content */}
                            <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-white">
                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {/* Title Input */}
                                    <input
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="block w-full text-2xl font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder-gray-400 bg-transparent mb-6 transition-colors hover:bg-gray-50 rounded px-2 -mx-2 focus:bg-white"
                                        placeholder="Task Title"
                                    />

                                    {/* Tabs */}
                                    <div className="flex space-x-6 border-b border-gray-200 mb-6">
                                        <button
                                            onClick={() => setActiveTab('details')}
                                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('subtasks')}
                                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'subtasks' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Subtasks ({formData.subtasks?.filter(s => !s.completed).length || 0})
                                        </button>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="space-y-6">
                                        {activeTab === 'details' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                        <BookOpen size={16} /> Description
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        value={formData.description || ''}
                                                        onChange={(e) => handleChange('description', e.target.value)}
                                                        className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50/50 focus:bg-white transition-all resize-y min-h-[100px]"
                                                        placeholder="Add a more detailed description..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                                        <select
                                                            value={formData.status}
                                                            onChange={(e) => handleChange('status', e.target.value)}
                                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                        >
                                                            <option value="todo">To Do</option>
                                                            <option value="inprogress">In Progress</option>
                                                            <option value="review">Review</option>
                                                            <option value="done">Done</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
                                                        <select
                                                            value={formData.priority || 'medium'}
                                                            onChange={(e) => handleChange('priority', e.target.value)}
                                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                        >
                                                            <option value="low">Low</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="high">High</option>
                                                            <option value="critical">Critical</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assignee</label>
                                                        {members.length > 0 ? (
                                                            <select
                                                                value={formData.assignees?.[0] || ""}
                                                                onChange={(e) => handleChange('assignees', [e.target.value])}
                                                                className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                            >
                                                                <option value="">Unassigned</option>
                                                                {members.map(m => (
                                                                    <option key={m.userId._id} value={m.userId._id}>{m.userId.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200 text-sm text-gray-600 shadow-sm">
                                                                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                                                                    {getAssigneeInitial()}
                                                                </div>
                                                                <span>{getAssigneeName()}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
                                                        <input
                                                            type="date"
                                                            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                                                            onChange={(e) => handleChange('dueDate', e.target.value)}
                                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                        />
                                                    </div>

                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                            <Tag size={12} /> Tags
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.tags}
                                                            onChange={(e) => handleChange('tags', e.target.value)}
                                                            placeholder="marketing, Q1, urgent"
                                                            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'subtasks' && (
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                                    <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                        <ListChecks size={16} /> Checklist
                                                    </h4>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {formData.subtasks?.map((st, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors group">
                                                            <button
                                                                onClick={() => toggleSubtask(i)}
                                                                className={`flex-shrink-0 transition-colors ${st.completed ? 'text-brand-500' : 'text-gray-300 hover:text-gray-400'}`}
                                                            >
                                                                {st.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                                            </button>
                                                            <span className={`flex-1 text-sm ${st.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                                {st.title}
                                                            </span>
                                                            <button
                                                                onClick={() => removeSubtask(i)}
                                                                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity p-1"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="p-3 bg-white">
                                                        <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                                                            <Plus size={18} className="text-gray-400" />
                                                            <input
                                                                value={newSubtask}
                                                                onChange={(e) => setNewSubtask(e.target.value)}
                                                                placeholder="Add an item..."
                                                                className="flex-1 text-sm border-none focus:ring-0 p-0 placeholder-gray-400"
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={!newSubtask.trim()}
                                                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-brand-50 hover:text-brand-600 disabled:opacity-0 transition-all font-medium"
                                                            >
                                                                Add
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Activity Stream */}
                            <div className="w-full md:w-1/3 bg-gray-50 flex flex-col border-l border-gray-200">
                                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Activity size={16} /> Activity
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {(commentsLoading || auditLoading) ? (
                                        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-500"></div></div>
                                    ) : timeline.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 text-sm italic">
                                            No activity yet.
                                        </div>
                                    ) : (
                                        timeline.map((item, index) => (
                                            <div key={index} className="flex gap-3 group">
                                                <div className="flex-shrink-0 pt-1">
                                                    {item.type === 'comment' ? (
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                                            {item.author?.name?.[0]}
                                                        </div>
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                            <Clock size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {item.type === 'comment' ? item.author?.name : (item.actor?.name || 'System')}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">{formatDateTime(item.timestamp)}</span>
                                                    </div>

                                                    {item.type === 'comment' ? (
                                                        <div className="text-sm text-gray-800 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm leading-relaxed relative">
                                                            {item.text}
                                                            <div className="absolute top-2.5 -left-1.5 w-2 h-2 bg-white border-l border-t border-gray-200 transform -rotate-45"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-500 italic">
                                                            {item.action === 'task.created' && 'created this task'}
                                                            {item.action === 'task.updated' && `updated ${item.meta?.updates?.join(', ') || 'fields'}`}
                                                            {item.action === 'task.deleted' && 'deleted this task'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-4 bg-white border-t border-gray-200">
                                    <form onSubmit={handleSendComment} className="flex gap-2">
                                        <input
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all focus:pl-3"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
                            <div className="text-xs text-gray-400 hidden sm:block">
                                Press <span className="font-mono bg-gray-100 px-1 rounded">Esc</span> to close
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
