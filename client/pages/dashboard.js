import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { clearAuth } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/services/authApi';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { user, organizations } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-12 mb-10 shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10 animate-fade-in">
                <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
                    Welcome back, {user.name.split(' ')[0]}
                </h1>
                <p className="text-indigo-100 text-lg max-w-xl">
                    Ready to build something extraordinary today? Select a workspace to get started.
                </p>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-end mb-6 px-2">
            <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Your Workspaces</h2>
                <p className="text-slate-400 text-sm">Where your teams collaborate</p>
            </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link key={org._id} href={`/organizations/${org._id}`}>
              <div className="glass-card p-6 rounded-2xl group relative h-48 flex flex-col justify-between overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-indigo-400">
                             <span className="text-2xl">🏢</span>
                        </div>
                        <span className="bg-slate-800 border border-slate-700 text-xs py-1 px-2 rounded-full text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-colors">
                            {org.plan === 'pro' ? 'PRO' : 'FREE'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{org.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{org.members?.length || 1} Member{org.members?.length !== 1 && 's'}</p>
                </div>
                
                <div className="relative z-10 pt-4 border-t border-white/5 mt-4 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-600">{org.slug}</span>
                    <span className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        →
                    </span>
                </div>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          ))}
          
          {/* Create New Card */}
          <button 
                onClick={() => alert("Phase 2 Feature: Invite Only for now")}
                className="group p-6 rounded-2xl border border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30 flex flex-col items-center justify-center h-48 transition-all"
          >
             <div className="w-14 h-14 rounded-full bg-slate-800 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/50 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 mb-3">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
             </div>
             <span className="text-slate-400 group-hover:text-white font-medium transition-colors">Create Workspace</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
