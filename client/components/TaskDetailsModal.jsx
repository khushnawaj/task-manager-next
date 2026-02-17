import { useState } from 'react';
import { useGetTaskCommentsQuery, useAddCommentMutation, useGetTaskAuditLogQuery } from '../store/services/tasksApi';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, BookOpen, MessageSquare, Send, Tag, Activity, List, CheckSquare, Square, Check, Clock, Shield, User, ChevronRight, Hash, MoreHorizontal, AlignLeft, Settings, Plus, Edit2, UserPlus, FileText } from 'lucide-react';
import { PRIORITY_COLORS, TYPE_ICONS, formatDateTime } from '../utils/taskUtils';
import { useSelector } from 'react-redux';

export default function TaskDetailsModal({ task, onClose, onUpdate, onDelete, members = [] }) {
    const [formData, setFormData] = useState({
        ...task,
        assignees: task.assignees?.map(a => typeof a === 'object' ? a._id : a) || [],
        tags: task.tags?.join(', ') || '',
        subtasks: task.subtasks || []
    });
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('details');

    const { data: comments = [], isLoading: commentsLoading } = useGetTaskCommentsQuery(task._id);
    const [addComment] = useAddCommentMutation();
    const [newComment, setNewComment] = useState("");

    const { data: auditLogs = [], isLoading: auditLoading } = useGetTaskAuditLogQuery(task._id);

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
        toast.success("Changes saved");
        onClose();
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await addComment({ taskId: task._id, text: newComment }).unwrap();
            setNewComment("");
            toast.success("Comment posted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to post comment");
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

    const timeline = [
        ...comments.map(c => ({ ...c, type: 'comment', timestamp: c.createdAt })),
        ...auditLogs.map(l => ({ ...l, type: 'audit', timestamp: l.createdAt }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-zinc-950 border border-border-strong rounded-3xl shadow-premium-xl w-full max-w-6xl max-h-[90dvh] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <header className="px-4 md:px-8 py-4 border-b border-border flex justify-between items-center bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 group cursor-default">
                                <div className="p-2 bg-zinc-800 rounded-lg text-brand-400 group-hover:bg-brand-500/10 transition-colors">
                                    {TYPE_ICONS[formData.type || 'task']}
                                </div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{formData.type || 'Task'}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-zinc-800" />
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-zinc-600">
                                <Hash size={12} /> {task._id.slice(-8).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={onDelete} className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all">
                                <Trash2 size={18} />
                            </button>
                            <button className="p-2 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all">
                                <MoreHorizontal size={18} />
                            </button>
                            <div className="w-[1px] h-4 bg-zinc-800 mx-2" />
                            <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row bg-background">
                        {/* Main Editor Section */}
                        <div className="w-full md:flex-1 md:overflow-y-auto p-6 md:p-12 border-b md:border-b-0 md:border-r border-border custom-scrollbar">
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <input
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full text-xl md:text-2xl font-semibold text-zinc-50 bg-transparent border-none p-0 focus:ring-0 placeholder-zinc-800 mb-6 md:mb-8 tracking-tight"
                                    placeholder="Task Title"
                                />

                                <div className="flex gap-6 border-b border-border mb-6 md:mb-8">
                                    {['details', 'subtasks'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-zinc-50' : 'text-zinc-600 hover:text-zinc-400'
                                                }`}
                                        >
                                            {tab} {tab === 'subtasks' && `(${formData.subtasks?.length || 0})`}
                                            {activeTab === tab && (
                                                <motion.div layoutId="modalActiveTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-500 rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'details' && (
                                    <div className="space-y-8 md:space-y-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                                <AlignLeft size={14} /> Description
                                            </div>
                                            <textarea
                                                rows={8}
                                                value={formData.description || ''}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                className="w-full bg-zinc-900 border border-border rounded-2xl p-4 md:p-6 text-sm text-zinc-300 placeholder-zinc-700 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none shadow-premium-sm"
                                                placeholder="Add context or instructions for this task..."
                                            />
                                        </div>

                                        <div className="bg-zinc-900/50 border border-border rounded-2xl p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="col-span-full flex items-center gap-2 border-b border-border pb-4 mb-2">
                                                <Settings size={14} className="text-zinc-600" />
                                                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Properties</span>
                                            </div>
                                            {[
                                                { label: 'Status', field: 'status', type: 'select', options: ['todo', 'inprogress', 'review', 'done'] },
                                                { label: 'Priority', field: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
                                                { label: 'Assignee', field: 'assignees', type: 'assignee' },
                                                { label: 'Due Date', field: 'dueDate', type: 'date' },
                                                { label: 'Tags', field: 'tags', type: 'text', span: 'col-span-full' }
                                            ].map((opt) => (
                                                <div key={opt.field} className={opt.span || ''}>
                                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2 block ml-1">{opt.label}</label>
                                                    {opt.type === 'select' ? (
                                                        <div className="relative">
                                                            <select
                                                                value={formData[opt.field] || ''}
                                                                onChange={(e) => handleChange(opt.field, e.target.value)}
                                                                className="input-field appearance-none cursor-pointer pr-10"
                                                            >
                                                                {opt.options.map(o => (
                                                                    <option key={o} value={o} className="bg-zinc-950 text-white">{o.toUpperCase()}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" />
                                                        </div>
                                                    ) : opt.type === 'assignee' ? (
                                                        <div className="relative">
                                                            <select
                                                                value={formData.assignees?.[0] || ''}
                                                                onChange={(e) => handleChange('assignees', [e.target.value])}
                                                                className="input-field appearance-none cursor-pointer pr-10"
                                                            >
                                                                <option value="" className="bg-zinc-950">UNASSIGNED</option>
                                                                {members.map(m => (
                                                                    <option key={m.userId?._id} value={m.userId?._id} className="bg-zinc-950 text-white">{m.userId?.name.toUpperCase()}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" />
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type={opt.type === 'date' ? 'date' : 'text'}
                                                            className="input-field"
                                                            value={opt.type === 'date' ? (formData[opt.field]?.split('T')[0] || '') : formData[opt.field]}
                                                            onChange={(e) => handleChange(opt.field, e.target.value)}
                                                            placeholder={opt.label + "..."}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'subtasks' && (
                                    <div className="space-y-6">
                                        <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm divide-y divide-border">
                                            {formData.subtasks?.map((st, i) => (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="flex items-center gap-4 p-5 hover:bg-zinc-800/30 transition-all group">
                                                    <button onClick={() => toggleSubtask(i)} className={`transition-all ${st.completed ? 'text-brand-500' : 'text-zinc-700 hover:text-zinc-500'}`}>
                                                        {st.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                                    </button>
                                                    <span className={`text-sm font-medium flex-1 transition-all ${st.completed ? 'text-zinc-600 line-through decoration-brand-500/30' : 'text-zinc-300'}`}>
                                                        {st.title}
                                                    </span>
                                                    <button onClick={() => removeSubtask(i)} className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-500/10 rounded-lg">
                                                        <X size={16} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                            <form onSubmit={handleAddSubtask} className="p-4 bg-zinc-950/50">
                                                <div className="relative">
                                                    <input
                                                        value={newSubtask}
                                                        onChange={(e) => setNewSubtask(e.target.value)}
                                                        placeholder="Press Enter to add subtask..."
                                                        className="w-full bg-zinc-900 border border-dashed border-border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-brand-500/50 focus:ring-0 transition-all"
                                                    />
                                                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-500 transition-all">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Activity Sidebar */}
                        <div className="w-full md:w-[400px] bg-zinc-950 border-t md:border-t-0 md:border-l border-border flex flex-col md:overflow-hidden shrink-0">
                            <div className="px-4 md:px-8 py-6 border-b border-border bg-zinc-900/20">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                    <Activity size={16} /> Activity Log
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {timeline.map((item, index) => {
                                    const isComment = item.type === 'comment';
                                    const actionText = isComment ? 'commented' : item.action?.includes('create') ? 'created this task' : 'updated task';
                                    const updatesText = !isComment && item.meta?.updates?.length > 0 ? `Changed ${item.meta.updates.join(', ')}` : '';

                                    return (
                                        <div key={index} className="flex gap-3 group/item">
                                            <div className="shrink-0 pt-1">
                                                <div
                                                    title={item.author?.name || 'System'}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-white/5 transition-transform hover:scale-110 cursor-help ${isComment ? 'bg-zinc-800 text-brand-400' : 'bg-zinc-900 text-zinc-500'
                                                        }`}
                                                >
                                                    {isComment && item.author?.name ? item.author.name[0].toUpperCase() :
                                                        item.action?.includes('create') ? <Plus size={14} /> :
                                                            item.action?.includes('update') ? <Edit2 size={12} /> :
                                                                <Activity size={12} />
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                        <span className="text-[11px] font-bold text-zinc-300 truncate">
                                                            {item.author?.name || 'System'}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-600 truncate">
                                                            {actionText}
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] text-zinc-600 whitespace-nowrap ml-2">
                                                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                {isComment ? (
                                                    <div className="bg-zinc-900/80 border border-zinc-800/50 rounded-r-xl rounded-bl-xl p-3 text-xs text-zinc-300 leading-relaxed shadow-sm">
                                                        {item.text}
                                                    </div>
                                                ) : (
                                                    <div className="text-[11px] text-zinc-500 italic flex items-center gap-1.5">
                                                        {updatesText && <div className="w-1 h-1 rounded-full bg-zinc-600" />}
                                                        {updatesText || 'System update'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {timeline.length === 0 && (
                                    <div className="py-12 text-center text-zinc-700 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                                            <MessageSquare size={20} className="opacity-30" />
                                        </div>
                                        <p className="text-xs font-medium">No activity recorded yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-border bg-zinc-900/30">
                                <form onSubmit={handleSendComment} className="relative group">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add comment..."
                                        rows={2}
                                        className="w-full bg-zinc-950 border border-border rounded-xl px-5 py-4 text-sm text-zinc-100 placeholder-zinc-700 focus:border-brand-500/50 shadow-inner resize-none outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="absolute right-4 bottom-4 p-2 text-zinc-600 hover:text-brand-500 disabled:opacity-0 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <footer className="px-4 md:px-8 py-5 border-t border-border bg-zinc-900/50 flex justify-between items-center">
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold text-zinc-700 uppercase tracking-widest">
                            <span className="px-1.5 py-0.5 border border-zinc-800 rounded bg-zinc-950">ESC</span> to Close
                            <span className="ml-4 px-1.5 py-0.5 border border-zinc-800 rounded bg-zinc-950">⌘S</span> to Save
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="btn-secondary px-6">Cancel</button>
                            <button onClick={handleSave} className="btn-primary px-8">Save Changes</button>
                        </div>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
