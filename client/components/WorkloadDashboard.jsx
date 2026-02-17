import { useMemo } from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp, BarChart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkloadDashboard({ tasks, members = [] }) {
    // Calculate workload per member
    const workloadData = useMemo(() => {
        const memberMap = new Map();

        // Initialize all members
        members.forEach(member => {
            const id = member.userId?._id || member.userId || member._id;
            memberMap.set(id, {
                id,
                name: member.userId?.name || member.name || 'Unknown',
                email: member.userId?.email || member.email || '',
                tasks: [],
                total: 0,
                inProgress: 0,
                overdue: 0,
                completed: 0
            });
        });

        // Count tasks per member
        tasks.forEach(task => {
            if (!task.assignees || task.assignees.length === 0) return;

            task.assignees.forEach(assignee => {
                const assigneeId = assignee._id || assignee;
                if (!memberMap.has(assigneeId)) {
                    memberMap.set(assigneeId, {
                        id: assigneeId,
                        name: assignee.name || 'Unknown',
                        email: assignee.email || '',
                        tasks: [],
                        total: 0,
                        inProgress: 0,
                        overdue: 0,
                        completed: 0
                    });
                }

                const data = memberMap.get(assigneeId);
                data.tasks.push(task);
                data.total++;

                if (task.status === 'inprogress') data.inProgress++;
                if (task.status === 'done') data.completed++;

                const now = new Date();
                if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'done') {
                    data.overdue++;
                }
            });
        });

        return Array.from(memberMap.values()).sort((a, b) => b.total - a.total);
    }, [tasks, members]);

    const getCapacityLevel = (total) => {
        if (total === 0) return 'available';
        if (total <= 3) return 'light';
        if (total <= 7) return 'balanced';
        if (total <= 12) return 'heavy';
        return 'overloaded';
    };

    const getCapacityColor = (level) => {
        switch (level) {
            case 'available': return 'text-zinc-500 bg-zinc-900 border-zinc-800';
            case 'light': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'balanced': return 'text-brand-400 bg-brand-500/10 border-brand-500/20';
            case 'heavy': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'overloaded': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-zinc-500 bg-zinc-900 border-zinc-800';
        }
    };

    const getBarColor = (level) => {
        switch (level) {
            case 'available': return 'bg-zinc-800';
            case 'light': return 'bg-emerald-500';
            case 'balanced': return 'bg-brand-500';
            case 'heavy': return 'bg-amber-500';
            case 'overloaded': return 'bg-rose-500';
            default: return 'bg-zinc-800';
        }
    };

    const totalTasks = tasks.length;
    const totalMembers = workloadData.length;
    const avgTasksPerMember = totalMembers > 0 ? (totalTasks / totalMembers).toFixed(1) : 0;
    const overloadedMembers = workloadData.filter(m => getCapacityLevel(m.total) === 'overloaded').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Workload Analysis</h2>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Resource allocation and capacity monitoring</p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Members', val: totalMembers, icon: Users, color: 'brand' },
                    { label: 'Avg Task Load', val: avgTasksPerMember, icon: TrendingUp, color: 'blue' },
                    { label: 'Project Flux', val: totalTasks, icon: CheckCircle, color: 'emerald' },
                    { label: 'Capacity Risk', val: overloadedMembers, icon: AlertTriangle, color: 'rose' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-zinc-900 border border-border p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-2 bg-zinc-950 rounded-xl border border-white/5 text-zinc-400 group-hover:text-white transition-colors`}>
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

            {/* Distribution Map */}
            <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-premium-sm">
                <div className="px-6 py-5 border-b border-border bg-zinc-950/30 flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <BarChart size={14} /> Team Distribution Map
                    </h3>
                </div>

                <div className="p-6">
                    {workloadData.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-950/30 rounded-xl border border-dashed border-border">
                            <Users className="mx-auto h-12 w-12 text-zinc-800 mb-4" />
                            <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">No member data available</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {workloadData.map((member, i) => {
                                const level = getCapacityLevel(member.total);
                                const maxTasks = Math.max(...workloadData.map(m => m.total), 10);
                                const widthPercent = (member.total / maxTasks) * 100;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={member.id}
                                        className="group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-950 flex items-center justify-center text-xs font-semibold shadow-sm transition-all group-hover:scale-110">
                                                    {member.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate max-w-[120px] sm:max-w-[200px]">{member.name}</span>
                                                    <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-tighter truncate max-w-[120px] sm:max-w-[200px]">{member.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium uppercase tracking-widest border transition-colors ${getCapacityColor(level)}`}>
                                                    {level}
                                                </span>
                                                <span className="text-sm font-semibold text-zinc-400 tabular-nums w-8 text-right">
                                                    {member.total}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${widthPercent}%` }}
                                                transition={{ duration: 1, ease: 'circOut', delay: i * 0.1 }}
                                                className={`absolute inset-y-0 left-0 ${getBarColor(level)} rounded-full shadow-[0_0_8px_rgba(255,255,255,0.05)]`}
                                            />
                                        </div>

                                        <div className="mt-2.5 flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                                            <span className="text-zinc-500">Breakdown:</span>
                                            <span className="text-brand-400">{member.inProgress} Active</span>
                                            {member.overdue > 0 && <span className="text-rose-500">{member.overdue} Overdue</span>}
                                            <span className="text-zinc-700">{member.completed} Completed</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Risk Alert */}
            {overloadedMembers > 0 && (
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle size={64} className="text-rose-500" />
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-2.5 bg-rose-500 rounded-xl text-white shadow-premium-md">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-rose-100 uppercase tracking-widest">Resource Overload Detected</h4>
                            <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                                {overloadedMembers} team members are currently operating at critical capacity (&gt;12 tasks).
                                We recommend redistributing pending work to available team members to prevent output saturation and maintain engineering quality.
                            </p>
                            <button className="mt-4 text-[10px] font-semibold text-rose-400 hover:text-rose-300 uppercase tracking-[0.2em] flex items-center gap-2 group/btn">
                                View Overloaded Profiles <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
