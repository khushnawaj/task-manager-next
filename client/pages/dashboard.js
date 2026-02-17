import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useGetDashboardDataQuery } from '../store/services/userApi';
import { useGetHeatmapQuery } from '../store/services/analyticsApi';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { useGetMyOrganizationsQuery } from '../store/services/organizationApi';
import {
  LayoutDashboard,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, initialized } = useSelector((state) => state.auth);
  const router = useRouter();
  const { data: dashboardData, isLoading: statsLoading } = useGetDashboardDataQuery(undefined, {
    skip: !user || !initialized
  });
  const { data: organizations = [], isLoading: orgsLoading } = useGetMyOrganizationsQuery(undefined, {
    skip: !user || !initialized
  });
  const { data: heatmapData = [] } = useGetHeatmapQuery(undefined, {
    skip: !user || !initialized
  });

  useEffect(() => {
    if (initialized && !user) router.push('/login');
  }, [user, initialized, router]);

  // Move early return after all hooks
  const stats = [
    { label: 'Active Projects', value: dashboardData?.stats?.activeProjects || '0', icon: LayoutDashboard, color: 'text-brand-400' },
    { label: 'Tasks Completed', value: dashboardData?.stats?.tasksCompleted || '0', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Due Soon', value: dashboardData?.stats?.dueSoon || '0', icon: Clock, color: 'text-amber-400' },
    { label: 'Urgent Issues', value: dashboardData?.stats?.urgentIssues || '0', icon: AlertCircle, color: 'text-rose-400' },
  ];

  if (!initialized || !user) return null;

  const isLoading = statsLoading || orgsLoading;

  return (
    <Layout title="Dashboard">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">
              Dashboard
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Welcome back, {user.name.split(' ')[0]}. Here is what's happening today.
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Project</span>
          </button>
        </header>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className={`p-5 bg-zinc-900 border border-border rounded-xl shadow-premium-sm hover:border-border-strong transition-all group ${isLoading ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-zinc-950 border border-white/5 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-zinc-50 tracking-tight">{stat.value}</span>
                <div className="mb-1 flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  <TrendingUp size={10} />
                  {dashboardData?.stats?.velocity || '+0%'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heatmap Section */}
        <div className="mb-12">
          <ContributionHeatmap data={heatmapData} />
        </div>

        {/* Workspaces Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-zinc-500" />
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Workspaces</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizations.map((org, i) => (
              <Link key={org._id} href={`/organizations/${org._id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="group relative p-8 bg-zinc-900 border border-border rounded-2xl hover:border-brand-500/50 hover:shadow-premium-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-brand-500/10 transition-all duration-700" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-zinc-400 group-hover:text-brand-400 transition-colors shadow-inner">
                        <LayoutDashboard size={24} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded border ${org.plan === 'pro'
                          ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-white/5'
                          }`}>
                          {org.plan === 'pro' ? 'Business' : 'Free'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-zinc-50 group-hover:text-white transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5 opacity-80">
                        {org.slug || "workspace"} <ChevronRight size={12} className="text-zinc-700" />
                        <span className="text-zinc-600">{org.members?.length || 1} members</span>
                      </p>
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {(org.members || []).slice(0, 3).map((m, idx) => (
                          <div key={idx} title={m.userId?.name} className="inline-block h-6 w-6 rounded-full ring-2 ring-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-white/5 shadow-inner">
                            {m.userId?.name?.[0].toUpperCase() || '?'}
                          </div>
                        ))}
                        {org.members?.length > 3 && (
                          <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-zinc-900 bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-500">
                            +{org.members.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 group-hover:text-brand-400 transition-all">
                        Enter Workspace
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}

            {/* Empty State */}
            {organizations.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50">
                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-700 mb-6 border border-white/5">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-lg font-bold text-zinc-300 mb-1">No Workspaces Found</h3>
                <p className="text-zinc-500 text-sm max-w-xs text-center mb-8 px-4 font-medium">
                  Ask your administrator to invite you to a workspace to see your projects here.
                </p>
                <div className="flex gap-4">
                  <button className="btn-secondary">Check Invitations</button>
                  <button className="btn-primary">Create Workspace</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Global Activity / Timeline Mock */}
        <section className="mt-16 pt-16 border-t border-border">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp size={16} className="text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Recent Activity</h2>
          </div>
          <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-md">
            {isLoading ? (
              <div className="p-8 text-center text-zinc-500 font-medium animate-pulse">Synchronizing activity stream...</div>
            ) : dashboardData?.recentActivity?.length > 0 ? (
              dashboardData.recentActivity.map((log, i) => (
                <div key={log._id} className={`flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors cursor-default ${i !== dashboardData.recentActivity.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-active border border-border flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                    {log.actor?.name?.[0].toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-zinc-200">
                      {log.actor?.name} <span className="text-zinc-500 font-medium">{log.action.replace('.', ' ')}</span> <span className="text-brand-500">{log.meta?.title || log.meta?.taskId?.slice(-6).toUpperCase() || 'Item'}</span>
                    </p>
                    <p className="text-[10px] text-zinc-600 font-medium mt-0.5">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.projectId?.name || 'Workspace'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-zinc-500 text-sm font-medium">No recent activity found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
