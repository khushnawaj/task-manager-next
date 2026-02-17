import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useGetAdminStatsQuery } from '../store/services/adminApi';
import { Shield, Users, LayoutDashboard, Globe, ArrowUpRight, Plus, ExternalLink, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, initialized } = useSelector(state => state.auth);
    const { data: adminData, isLoading, error } = useGetAdminStatsQuery(undefined, {
        skip: !user || user.role !== 'admin' || !initialized
    });

    useEffect(() => {
        if (initialized) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/dashboard'); // Kick non-admins out
            }
        }
    }, [user, initialized, router]);

    const stats = useMemo(() => [
        { label: 'Platform Users', value: adminData?.stats?.userCount || '0', icon: Users, color: 'text-brand-400' },
        { label: 'Active Projects', value: adminData?.stats?.projectCount || '0', icon: LayoutDashboard, color: 'text-indigo-400' },
        { label: 'Total Workspaces', value: adminData?.stats?.orgCount || '0', icon: Globe, color: 'text-emerald-400' },
    ], [adminData]);

    if (!initialized || !user || user.role !== 'admin') return null;

    return (
        <Layout title="Admin Console">
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 bg-zinc-950 border border-border rounded-2xl text-purple-400 shadow-inner">
                            <Shield size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1.5">
                                <Zap size={12} className="text-zinc-700" /> System Infrastructure
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-50 tracking-tight">System Overview</h1>
                        </div>
                    </div>
                </div>

                {/* KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="p-6 bg-zinc-900 border border-border rounded-2xl shadow-premium-sm hover:border-zinc-700 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <stat.icon size={48} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl bg-zinc-950 border border-white/5 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="flex items-end justify-between relative z-10">
                                <span className="text-3xl font-bold text-zinc-50 tracking-tight tabular-nums">{isLoading ? '---' : stat.value}</span>
                                <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-white cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800">
                                    Report <ArrowUpRight size={12} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-zinc-900 border border-border rounded-2xl shadow-premium-lg overflow-hidden flex flex-col"
                    >
                        <div className="px-6 py-5 border-b border-border bg-active/10 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Users size={14} className="text-brand-500" /> Personal Node Signups
                            </h3>
                            <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-brand-400 transition-colors uppercase tracking-[0.2em]">View All</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                            {isLoading ? (
                                <div className="p-12 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning user grid...</div>
                            ) : adminData?.recentUsers?.map((u, i) => (
                                <div key={u._id} className={`p-5 flex items-center justify-between hover:bg-active/10 transition-colors group ${i !== adminData.recentUsers.length - 1 ? 'border-b border-border/50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-border flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-active transition-all font-bold text-sm shadow-inner uppercase">
                                            {u.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                                {u.name}
                                                {u.role === 'admin' && <Shield size={10} className="text-purple-400" />}
                                            </div>
                                            <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">{u.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {u.role}
                                        </span>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-600">
                                            <Calendar size={10} /> {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Orgs */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-border rounded-2xl shadow-premium-lg overflow-hidden flex flex-col"
                    >
                        <div className="px-6 py-5 border-b border-border bg-active/10 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={14} className="text-emerald-500" /> New Workspace Initializations
                            </h3>
                            <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">Management</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                            {isLoading ? (
                                <div className="p-12 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs animate-pulse">Fetching org tree...</div>
                            ) : adminData?.recentOrgs?.map((org, i) => (
                                <div key={org._id} className={`p-5 flex items-center justify-between hover:bg-active/10 transition-colors group ${i !== adminData.recentOrgs.length - 1 ? 'border-b border-border/50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-border flex items-center justify-center text-zinc-600 group-hover:text-emerald-400 transition-all font-bold text-xs uppercase">
                                            {org.slug?.slice(0, 2) || 'WS'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">{org.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.1em]">Plan:</span>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${org.plan === 'enterprise' ? 'text-purple-400' : org.plan === 'pro' ? 'text-brand-400' : 'text-zinc-600'}`}>{org.plan}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <button className="p-1.5 bg-zinc-950 border border-white/5 rounded-lg text-zinc-600 hover:text-white transition-all shadow-inner">
                                            <ExternalLink size={12} />
                                        </button>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-600">
                                            <Calendar size={10} /> {new Date(org.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
