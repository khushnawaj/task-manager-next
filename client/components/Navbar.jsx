import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/services/authApi';
import { clearAuth } from '../store/slices/authSlice';
import { useState } from 'react';

export default function Navbar({ transparent = false }) {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-slate-900/80 backdrop-blur-md border-b border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              N
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Nexus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${router.pathname === '/dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
              Workspaces
            </Link>

            <div className="h-5 w-px bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-700 items-center justify-center flex text-xs font-bold text-indigo-400 overflow-hidden relative cursor-pointer hover:border-indigo-500 transition-colors">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
