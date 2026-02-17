import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/services/authApi';
import { clearAuth } from '../store/slices/authSlice';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    CheckSquare,
    LogOut,
    Shield,
    Zap,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Plus,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
    const { user, organizations: authOrgs } = useSelector(state => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        await logout();
        dispatch(clearAuth());
        router.push('/login');
    };

    const activeOrgId = authOrgs?.[0]?._id || authOrgs?.[0] || 'default';

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
        { name: 'Team', href: `/organizations/${activeOrgId}/team`, icon: Users },
        { name: 'Analytics', href: `/organizations/${activeOrgId}/analytics`, icon: BarChart3 },
    ];

    const isActive = (path) => router.pathname === path;

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[60] md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-y-0 left-0 w-[280px] bg-background border-r border-border flex flex-col z-[70] shadow-premium-xl md:hidden"
                    >
                        {/* Header */}
                        <div className="h-16 flex items-center px-6 border-b border-border justify-between bg-surface">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-zinc-950 shadow-premium-sm">
                                    <Zap size={18} strokeWidth={2.5} />
                                </div>
                                <span className="font-semibold text-lg text-white">Forge</span>
                            </div>
                            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                            <div>
                                <h2 className="px-3 mb-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.2em]">Workspace</h2>
                                <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <Link key={item.name} href={item.href} onClick={onClose}>
                                            <div className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 group relative ${isActive(item.href)
                                                ? 'bg-background text-white border border-border shadow-premium-sm'
                                                : 'text-fg-muted hover:text-white hover:bg-active'
                                                }`}>
                                                <item.icon size={18} strokeWidth={isActive(item.href) ? 2 : 1.5} className={isActive(item.href) ? 'text-brand-500' : 'text-fg-muted group-hover:text-white'} />
                                                <span className="text-sm font-semibold tracking-tight">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {user.role === 'admin' && (
                                <div>
                                    <h2 className="px-3 mb-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.2em]">Management</h2>
                                    <Link href="/admin" onClick={onClose}>
                                        <div className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 group ${isActive('/admin') ? 'bg-background text-white border border-border shadow-premium-sm' : 'text-fg-muted hover:text-white hover:bg-active'}`}>
                                            <Shield size={18} className={isActive('/admin') ? 'text-purple-400' : 'text-fg-muted group-hover:text-white'} />
                                            <span className="text-sm font-semibold tracking-tight">Admin Console</span>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-surface">
                            <div className="flex items-center gap-3 p-3 rounded-md bg-background border border-border">
                                <div className="h-10 w-10 rounded-md bg-active flex items-center justify-center text-white font-semibold border border-border shrink-0">
                                    {user.name?.[0]}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-semibold text-white truncate leading-tight">{user.name}</p>
                                    <p className="text-[10px] font-medium text-fg-muted uppercase tracking-widest mt-0.5">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
