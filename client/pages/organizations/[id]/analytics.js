import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import { useGetOrganizationQuery } from '../../../store/services/organizationApi';
import { useGetHeatmapQuery } from '../../../store/services/analyticsApi';
import ContributionHeatmap from '../../../components/ContributionHeatmap';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, CheckCircle2,
    Zap, Activity, PieChart as PieIcon, ChevronRight
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

export default function AnalyticsPage() {
    const router = useRouter();
    const { id: organizationId } = router.query;
    const { user } = useSelector(state => state.auth);

    const { data: orgData, isLoading: orgLoading } = useGetOrganizationQuery(organizationId, { skip: !organizationId });
    const { data: heatmapData = [] } = useGetHeatmapQuery(undefined, { skip: !user });

    if (!user || orgLoading) return <Layout title="System Intelligence">
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    </Layout>;

    // Mock data for global metrics (in real app, fetch from backend)
    const velocityData = [
        { week: 'Week 1', completed: 12, backlog: 40 },
        { week: 'Week 2', completed: 18, backlog: 35 },
        { week: 'Week 3', completed: 15, backlog: 38 },
        { week: 'Week 4', completed: 25, backlog: 28 },
    ];

    const stats = [
        { label: 'Network Velocity', value: '84%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
        { label: 'Active Operatives', value: orgData?.organization?.members?.length || '0', icon: Users, color: 'text-brand-400', bg: 'bg-brand-400/5' },
        { label: 'Synchronization', value: '99.9%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/5' },
        { label: 'Task Throughput', value: '1.2k', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/5' },
    ];

    return (
        <Layout title="System Intelligence">
            <div className="max-w-7xl mx-auto space-y-10 py-4">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">
                            <BarChart3 size={12} /> Analytical Intelligence
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">System Analytics</h1>
                        <p className="text-sm font-medium text-zinc-500 max-w-md">
                            High-fidelity delivery metrics and personnel performance synchronization for <span className="text-zinc-300 font-bold">{orgData?.organization?.name}</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live Feed
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="bg-zinc-900 border border-white/5 p-6 rounded-3xl shadow-premium-sm group hover:border-white/10 transition-all duration-300"
                        >
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 border border-current/10 shadow-inner group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Productivity Heatmap */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-2">Productivity Pulse (Organization Wide)</h3>
                    <ContributionHeatmap data={heatmapData} />
                </div>

                {/* Analytical Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Network Velocity Chart */}
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-premium-sm flex flex-col h-[400px]">
                        <div className="px-6 py-5 border-b border-white/5 bg-zinc-950/20 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={14} /> Network Velocity
                            </h3>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Last 30 Days</span>
                        </div>
                        <div className="flex-1 p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData}>
                                    <defs>
                                        <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF785A" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF785A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="week" stroke="#52525b" fontSize={10} fontWeight="bold" />
                                    <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="completed" stroke="#FF785A" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operational Throughput */}
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-premium-sm flex flex-col h-[400px]">
                        <div className="px-6 py-5 border-b border-white/5 bg-zinc-950/20 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} /> Operational Throughput
                            </h3>
                            <button className="text-[10px] font-bold text-brand-400 uppercase tracking-wider hover:text-brand-300 transition-colors">Download Report</button>
                        </div>
                        <div className="flex-1 p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={velocityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="week" stroke="#52525b" fontSize={10} fontWeight="bold" />
                                    <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="completed" fill="#FF785A" radius={[6, 6, 0, 0]} barSize={32} />
                                    <Bar dataKey="backlog" fill="#27272a" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Insight Banner */}
                <div className="bg-brand-500 border border-brand-400 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Generate Strategy Forecast</h2>
                            <p className="text-white/80 text-sm font-medium max-w-md">Utilize Neural Forge intelligence to predict delivery bottlenecks and optimize personnel allocation for the next 4 cycles.</p>
                        </div>
                        <button className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Initiate Analysis
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
