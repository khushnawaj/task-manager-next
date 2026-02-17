import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/services/authApi';
import { clearAuth } from '../store/slices/authSlice';
import { useState } from 'react';
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Users,
  BarChart3,
  ChevronDown,
  CheckSquare,
  Zap,
  Bell,
  Search,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';
import { useGetNotificationsQuery } from '../store/services/notificationApi';

export default function Navbar({ onMenuClick }) {
  const { user, organizations: authOrgs } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
    skip: !user
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    router.push('/login');
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('nexus-open-search'));
  };

  if (!user) return null;
  const activeOrgId = authOrgs?.[0]?._id || authOrgs?.[0] || 'default';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { name: 'Team', href: `/organizations/${activeOrgId}/team`, icon: Users },
    { name: 'Analytics', href: `/organizations/${activeOrgId}/analytics`, icon: BarChart3 },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="h-16 bg-surface border-b border-border sticky top-0 z-40 px-4 flex items-center justify-between shadow-premium-sm transition-all">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon */}
        <button
          onClick={onMenuClick}
          className="p-2 text-fg-muted hover:text-white hover:bg-active rounded-md transition-all md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-zinc-950 shadow-premium-sm transition-transform group-hover:scale-105 shrink-0">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-base tracking-tight text-white hidden sm:block">Forge</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 ml-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer ${isActive(item.href)
                ? 'bg-zinc-800 text-white border border-white/5 shadow-inner'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                }`}>
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={openSearch}
          className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all hidden sm:flex items-center gap-2 group border border-transparent hover:border-white/5"
        >
          <Search size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Search</span>
          <kbd className="hidden lg:flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded bg-zinc-950 border border-white/10 text-[9px] text-zinc-500 grayscale group-hover:grayscale-0">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 rounded-xl transition-all relative border border-transparent hover:border-white/5 hover:bg-white/5 ${isNotificationsOpen ? 'text-white bg-white/5 border-white/5' : 'text-zinc-500 hover:text-white'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-surface animate-pulse shadow-[0_0_8px_#FF785A]"></span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        <div className="w-[1px] h-4 bg-white/5 mx-1 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
          >
            <div className="h-8 w-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-xs border border-white/10 shadow-inner group-hover:text-brand-400 transition-colors">
              {user.name?.[0].toUpperCase()}
            </div>
            <ChevronDown size={14} className={`text-zinc-600 group-hover:text-zinc-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] py-2 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-white/5 mb-2 bg-zinc-950/20">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 capitalize flex items-center gap-2">
                      <Shield size={10} className="text-brand-500" /> {user.role} Identity
                    </p>
                  </div>

                  <div className="px-2 space-y-0.5">
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-brand-500 rounded-xl transition-all group">
                      <div className="p-2 bg-zinc-950 border border-white/5 rounded-lg group-hover:bg-brand-600 transition-colors">
                        <User size={14} />
                      </div>
                      Profile Configuration
                    </Link>

                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-indigo-500 rounded-xl transition-all group">
                        <div className="p-2 bg-zinc-950 border border-white/5 rounded-lg group-hover:bg-indigo-600 transition-colors">
                          <Shield size={14} />
                        </div>
                        System Intelligence
                      </Link>
                    )}

                    <div className="h-[1px] bg-white/5 my-2 mx-3" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-white hover:bg-danger rounded-xl transition-all group"
                    >
                      <div className="p-2 bg-zinc-950 border border-white/5 rounded-lg group-hover:bg-danger-strong transition-colors">
                        <LogOut size={14} />
                      </div>
                      Terminate Session
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
