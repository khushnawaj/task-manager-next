import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    CheckCircle, AlertCircle, Clock, ListChecks, TrendingUp, AlertTriangle
} from 'lucide-react';

const COLORS = {
    todo: '#64748b',        // Slate-500
    inprogress: '#3b82f6',  // Blue-500
    review: '#f59e0b',      // Amber-500
    done: '#10b981',        // Emerald-500
};

const PRIORITY_COLORS = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    critical: '#ef4444',
};

export default function ProjectDashboard({ tasks }) {
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

    // Overdue tasks (tasks with dueDate in the past and not done)
    const now = new Date();
    const overdueTasks = tasks.filter(t =>
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
    ).length;

    // Stale tasks (not updated in 7+ days and not done)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const staleTasks = tasks.filter(t =>
        t.updatedAt && new Date(t.updatedAt) < sevenDaysAgo && t.status !== 'done'
    ).length;

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Analytics</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time insights into team performance</p>
                </div>
            </div>

            {/* KPI Cards - Enhanced with new color system */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
                            <ListChecks size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Tasks</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{totalTasks}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completion</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{completionRate}%</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overdue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{overdueTasks}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stale (7d+)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{staleTasks}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-80">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Status Distribution</h3>
                    {statusData.length > 0 ? (
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            No tasks to display
                        </div>
                    )}
                </div>

                {/* Priority Breakdown */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col h-80">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" />
                                <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Action Items Section */}
            {(overdueTasks > 0 || staleTasks > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-amber-900">Action Required</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                {overdueTasks > 0 && `${overdueTasks} task${overdueTasks > 1 ? 's are' : ' is'} overdue. `}
                                {staleTasks > 0 && `${staleTasks} task${staleTasks > 1 ? 's have' : ' has'} not been updated in over 7 days.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
