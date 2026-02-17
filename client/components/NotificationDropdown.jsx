import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../store/services/notificationApi';
import { Bell, Check, CheckCheck, Info, Zap, UserPlus, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function NotificationDropdown({ isOpen, onClose }) {
    const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
        pollingInterval: 30000,
        skip: !isOpen
    });
    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type) => {
        switch (type) {
            case 'assignment': return <Zap size={14} className="text-brand-400" />;
            case 'invitation': return <UserPlus size={14} className="text-emerald-400" />;
            case 'mention': return <MessageSquare size={14} className="text-purple-400" />;
            case 'update': return <Info size={14} className="text-blue-400" />;
            default: return <Bell size={14} className="text-zinc-500" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">Intelligence Feed</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-brand-500/20">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                            >
                                Clear all <CheckCheck size={12} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-12 text-center text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] animate-pulse">Synchronizing nodes...</div>
                            ) : notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => markAsRead(n._id)}
                                        className={`p-4 flex gap-4 transition-all cursor-pointer relative group ${n.read ? 'opacity-60 grayscale-[0.5]' : 'bg-active/10'}`}
                                    >
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors overflow-hidden ${n.read ? 'bg-zinc-950 border-white/5 text-zinc-600' : 'bg-zinc-950 border-brand-500/20 text-brand-400'
                                            }`}>
                                            {n.senderId?.avatarUrl ? (
                                                <img src={n.senderId.avatarUrl} alt={n.senderId.name} className="h-full w-full object-cover" />
                                            ) : (
                                                getIcon(n.type)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-bold truncate ${n.read ? 'text-zinc-400' : 'text-zinc-100'}`}>{n.title}</p>
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase shrink-0">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }).replace('about ', '')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                                        </div>
                                        {!n.read && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_#FF785A]" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center flex flex-col items-center">
                                    <div className="h-12 w-12 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-800 mb-4">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No active alerts</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-zinc-950 border-t border-white/5 text-center">
                            <button className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-[0.2em]">View Notification Repository</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
