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
  CheckSquare
} from 'lucide-react';

export default function Navbar({ transparent = false }) {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    dispatch(clearAuth());
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className={`bg-white border-b border-brand-200 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Desktop Left: Logo & Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                  <LayoutDashboard size={20} />
                </div>
                <span className="font-display font-bold text-xl text-gray-900 tracking-tight">
                  TaskMaster
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${router.pathname === '/dashboard'
                ? 'border-brand-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Workspaces
              </Link>
              <Link href="/my-tasks" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${router.pathname === '/my-tasks'
                ? 'border-brand-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                My Tasks
              </Link>
              <Link href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Reports
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${router.pathname === '/admin' ? 'border-brand-500 text-brand-600' : 'border-transparent text-purple-600 hover:text-purple-800'}`}>
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right: Profile Dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 items-center gap-2"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border border-brand-200">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>

              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-down"
                  role="menu"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                    <User size={16} /> Profile
                  </Link>

                  {user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                      <Shield size={16} /> Admin Console
                    </Link>
                  )}

                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/dashboard" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${router.pathname === '/dashboard' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}>
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} /> Workspaces
              </div>
            </Link>
            <Link href="/my-tasks" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${router.pathname === '/my-tasks' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}>
              <div className="flex items-center gap-3">
                <CheckSquare size={20} /> My Tasks
              </div>
            </Link>
            <Link href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} /> Reports
              </div>
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-purple-600 hover:bg-purple-50 hover:border-purple-300">
                <div className="flex items-center gap-3">
                  <Shield size={20} /> Admin Console
                </div>
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg border border-brand-200">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Your Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
