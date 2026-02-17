import { useMemo } from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function WorkloadDashboard({ tasks, members = [] }) {
    // Calculate workload per member
    const workloadData = useMemo(() => {
        const memberMap = new Map();

        // Initialize all members
        members.forEach(member => {
            memberMap.set(member._id || member.userId, {
                id: member._id || member.userId,
                name: member.name || member.email,
                email: member.email,
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

    // Calculate capacity levels
    const getCapacityLevel = (total) => {
        if (total === 0) return 'available';
        if (total <= 3) return 'light';
        if (total <= 7) return 'balanced';
        if (total <= 12) return 'heavy';
        return 'overloaded';
    };

    const getCapacityColor = (level) => {
        switch (level) {
            case 'available': return 'bg-gray-100 text-gray-600';
            case 'light': return 'bg-emerald-100 text-emerald-700';
            case 'balanced': return 'bg-blue-100 text-blue-700';
            case 'heavy': return 'bg-amber-100 text-amber-700';
            case 'overloaded': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getBarColor = (level) => {
        switch (level) {
            case 'available': return 'bg-gray-300';
            case 'light': return 'bg-emerald-500';
            case 'balanced': return 'bg-blue-500';
            case 'heavy': return 'bg-amber-500';
            case 'overloaded': return 'bg-rose-500';
            default: return 'bg-gray-300';
        }
    };

    // Team stats
    const totalTasks = tasks.length;
    const totalMembers = workloadData.length;
    const avgTasksPerMember = totalMembers > 0 ? (totalTasks / totalMembers).toFixed(1) : 0;
    const overloadedMembers = workloadData.filter(m => getCapacityLevel(m.total) === 'overloaded').length;

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Workload</h2>
                    <p className="text-sm text-gray-500 mt-1">Balance distribution and identify bottlenecks</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Size</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{totalMembers}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Load</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{avgTasksPerMember}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Tasks</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{totalTasks}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overloaded</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{overloadedMembers}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workload Bars */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Task Distribution</h3>

                {workloadData.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Users className="mx-auto h-12 w-12 mb-3" />
                        <p className="text-sm">No team members found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workloadData.map((member) => {
                            const level = getCapacityLevel(member.total);
                            const maxTasks = Math.max(...workloadData.map(m => m.total), 15);
                            const widthPercent = (member.total / maxTasks) * 100;

                            return (
                                <div key={member.id} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-medium">
                                                {member.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCapacityColor(level)}`}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900 tabular-nums w-8 text-right">
                                                {member.total}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getBarColor(level)} transition-all duration-300 ease-out rounded-full`}
                                            style={{ width: `${widthPercent}%` }}
                                        />
                                    </div>

                                    {/* Task breakdown on hover */}
                                    <div className="mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {member.inProgress > 0 && <span className="mr-3">In Progress: {member.inProgress}</span>}
                                        {member.overdue > 0 && <span className="mr-3 text-rose-600">Overdue: {member.overdue}</span>}
                                        {member.completed > 0 && <span>Completed: {member.completed}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Alert if overloaded members exist */}
            {overloadedMembers > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-rose-900">Workload Alert</h4>
                            <p className="text-sm text-rose-700 mt-1">
                                {overloadedMembers} team member{overloadedMembers > 1 ? 's are' : ' is'} overloaded with 12+ tasks.
                                Consider redistributing work to maintain team health.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
