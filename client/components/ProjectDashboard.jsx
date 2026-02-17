import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { useGetVelocityQuery, useGetBurndownQuery } from '../store/services/analyticsApi';
import { useRouter } from 'next/router';
import format from 'date-fns/format';
import {
    CheckCircle, AlertCircle, Clock, ListChecks, TrendingUp, AlertTriangle, PieChart as PieIcon, BarChart2, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = {
    todo: '#3f3f46',        // Zinc-700
    inprogress: '#3b82f6',  // Blue-500
    review: '#818cf8',      // Indigo-400
    done: '#10b981',        // Emerald-500
};

const PRIORITY_COLORS = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    critical: '#ef4444',
};

export default function ProjectDashboard({ tasks }) {
    const router = useRouter();
    const { projectId } = router.query;

    // Fetch real historical velocity
    const { data: velocityData = [] } = useGetVelocityQuery(projectId, {
        skip: !projectId
    });
    // Status Distribution
    const statusData = [
        { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: COLORS.todo },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'inprogress').length, color: COLORS.inprogress },
        { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: COLORS.review },
        { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: COLORS.done },
    ].filter(d => d.value > 0);

    // Priority Breakdown
    const priorityData = [
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: PRIORITY_COLORS.low },
        { name: 'Medium', value: tasks.filter(t => (t.priority === 'medium' || !t.priority)).length, fill: PRIORITY_COLORS.medium },
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: PRIORITY_COLORS.high },
        { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, fill: PRIORITY_COLORS.critical },
    ];

    // Metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const urgentTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length;

    // Overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(t =>
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
    ).length;

    // Stale tasks
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const staleTasks = tasks.filter(t =>
        t.updatedAt && new Date(t.updatedAt) < sevenDaysAgo && t.status !== 'done'
    ).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Project Analytics</h2>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Real-time intelligence on delivery velocity</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Backlog', val: totalTasks, icon: ListChecks, color: 'brand' },
                    { label: 'Closure Rate', val: `${completionRate}%`, icon: TrendingUp, color: 'emerald' },
                    { label: 'Past Deadline', val: overdueTasks, icon: AlertTriangle, color: 'rose' },
                    { label: 'Inactivity (7d)', val: staleTasks, icon: Clock, color: 'amber' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-zinc-900 border border-border p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-2 bg-zinc-950 rounded-xl border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-semibold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-xl font-semibold text-zinc-100 mt-0.5 tabular-nums">{stat.val}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status distribution */}
                <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm flex flex-col h-[400px]">
                    <div className="px-6 py-4 border-b border-border bg-zinc-950/30 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <PieIcon size={14} /> Workflow States
                        </h3>
                    </div>
                    <div className="flex-1 p-6">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}
                                        itemStyle={{ color: '#f4f4f5' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                                <PieIcon size={40} className="mb-4 opacity-20" />
                                <p className="text-xs font-semibold uppercase tracking-widest">Insufficient Data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm flex flex-col h-[400px]">
                    <div className="px-6 py-4 border-b border-border bg-zinc-950/30 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <BarChart2 size={14} /> Criticality Analysis
                        </h3>
                    </div>
                    <div className="flex-1 p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="600" />
                                <YAxis dataKey="name" type="category" width={80} stroke="rgba(255,255,255,0.4)" fontSize={10} fontWeight="600" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Delivery Velocity (Area Chart) */}
                <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm flex flex-col h-[400px] lg:col-span-2">
                    <div className="px-6 py-4 border-b border-border bg-zinc-950/30 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} /> Weekly Delivery Velocity
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">8-Cycle Trend</span>
                    </div>
                    <div className="flex-1 p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                                <defs>
                                    <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2f81f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2f81f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="week"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    fontWeight="600"
                                    tickFormatter={(val) => format(new Date(val), 'MMM d')}
                                />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontWeight="600" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#2f81f7"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVel)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Actionable Insights */}
            {(overdueTasks > 0 || staleTasks > 0) && (
                <div className="bg-zinc-900 border border-border rounded-2xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={64} className="text-brand-500" />
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-2.5 bg-amber-500 rounded-xl text-zinc-950 shadow-premium-md">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Efficiency Alerts</h4>
                            <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
                                {overdueTasks > 0 && `We've detected ${overdueTasks} critical tasks that have exceeded their commitment dates. `}
                                {staleTasks > 0 && `Additionally, ${staleTasks} tasks show zero engagement over the last 7 cycles.`}
                            </p>
                            <button className="mt-4 text-[10px] font-semibold text-brand-400 hover:text-brand-300 uppercase tracking-[0.2em] flex items-center gap-2 group/btn">
                                Initiate Resolution Protocol <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
