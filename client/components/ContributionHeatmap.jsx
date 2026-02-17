import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ContributionHeatmap({ data = [] }) {
    // Generate grid for last 13 weeks (91 days)
    const weeks = useMemo(() => {
        const today = new Date();
        const grid = [];

        // Map data for quick lookup
        const dataMap = data.reduce((acc, curr) => {
            acc[curr.date] = curr.count;
            return acc;
        }, {});

        for (let w = 0; w < 13; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                // Calculate day offset from today to 91 days ago
                const offset = (12 - w) * 7 + (6 - d);
                date.setDate(date.getDate() - offset);
                const dateKey = date.toISOString().split('T')[0];

                week.push({
                    date: dateKey,
                    count: dataMap[dateKey] || 0
                });
            }
            grid.push(week);
        }
        return grid;
    }, [data]);

    const getColor = (count) => {
        if (count === 0) return 'bg-zinc-900 border-zinc-950/20';
        if (count < 3) return 'bg-success/20 border-success/10';
        if (count < 6) return 'bg-success/40 border-success/10';
        if (count < 10) return 'bg-success/70 border-success/10';
        return 'bg-success border-success/10';
    };

    return (
        <div className="bg-zinc-900 border border-border p-6 rounded-2xl overflow-hidden shadow-premium-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Productivity Pulse</h3>
                    <p className="text-[10px] text-zinc-600 font-medium mt-1">Activity metrics over the last 91 cycles</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Less</span>
                    {[0, 2, 5, 8, 12].map(c => (
                        <div key={c} className={`w-2.5 h-2.5 rounded-sm ${getColor(c)}`} />
                    ))}
                    <span className="text-[9px] font-bold text-zinc-600 uppercase ml-1">More</span>
                </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar lg:justify-center">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1.5">
                        {week.map((day, di) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (wi * 0.02) + (di * 0.01) }}
                                key={day.date}
                                title={`${day.date}: ${day.count} contributions`}
                                className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm border transition-all duration-300 hover:scale-125 hover:z-10 ${getColor(day.count)}`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest border-t border-white/5 pt-4">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <div className="flex items-center gap-1 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live synchronization
                </div>
            </div>
        </div>
    );
}
