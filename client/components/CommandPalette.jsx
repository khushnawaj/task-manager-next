import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Search, Command, ArrowRight, Zap, Target,
    Layout, CheckSquare, LogOut, Moon, Sun, Home,
    Briefcase, FileText, Hash, Users, Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useSearchQuery } from '../store/services/searchApi';

export default function CommandPalette() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const { data: searchResults, isLoading } = useSearchQuery(query, {
        skip: query.length < 2
    });

    // Toggle on Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);

            // Listen for custom search event from Navbar
            if (e.detail?.type === 'open-search') {
                setIsOpen(true);
            }
        };

        const handleCustomEvent = (e) => {
            if (e.type === 'nexus-open-search') setIsOpen(true);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('nexus-open-search', handleCustomEvent);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('nexus-open-search', handleCustomEvent);
        };
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const staticActions = [
        { id: 'dashboard', label: 'Dashboard Overview', icon: Layout, action: () => router.push('/dashboard'), type: 'NAV' },
        { id: 'my-tasks', label: 'My Assignment Node', icon: CheckSquare, action: () => router.push('/my-tasks'), type: 'NAV' },
        { id: 'profile', label: 'Identity Configuration', icon: Users, action: () => router.push('/profile'), type: 'NAV' },
    ];

    const results = [
        ...staticActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())),
        ...(searchResults?.projects || []).map(p => ({
            id: p._id,
            label: p.name,
            sublabel: p.key,
            icon: Briefcase,
            action: () => router.push(`/organizations/${p.organizationId}/projects/${p._id}`),
            type: 'PROJECT'
        })),
        ...(searchResults?.tasks || []).map(t => ({
            id: t._id,
            label: t.name,
            sublabel: t.projectId?.name || 'Task',
            icon: FileText,
            action: () => router.push(`/organizations/${t.projectId?.organizationId || ''}/projects/${t.projectId?._id}?task=${t._id}`),
            type: 'TASK'
        }))
    ];

    const handleSelect = (item) => {
        item.action();
        setIsOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => (i + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => (i - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="relative z-[110] w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
                    >
                        {/* Search Input */}
                        <div className="flex items-center border-b border-white/5 px-6 py-5 bg-zinc-900/50">
                            <Search className="h-5 w-5 text-zinc-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="block w-full border-none bg-transparent px-4 py-1 text-base text-zinc-100 placeholder-zinc-600 focus:ring-0"
                                placeholder="Search projects, tasks, or commands..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-lg border border-white/5 bg-zinc-950 px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest shadow-inner">Esc</span>
                            </div>
                        </div>

                        {/* Dropdown List */}
                        <div className="max-h-[480px] overflow-y-auto overflow-x-hidden custom-scrollbar py-2">
                            {results.length > 0 ? (
                                <ul className="px-2 space-y-0.5" id="options" role="listbox">
                                    {results.map((item, index) => (
                                        <li
                                            key={`${item.type}-${item.id}`}
                                            className={`group flex cursor-pointer select-none items-center rounded-xl px-4 py-3.5 transition-all outline-none ${index === selectedIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800/40 text-zinc-400'
                                                }`}
                                            role="option"
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl border transition-all duration-300 ${index === selectedIndex ? 'bg-zinc-950 border-white/10 text-brand-400' : 'bg-zinc-950/50 border-white/5 text-zinc-600'
                                                }`}>
                                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <div className="ml-4 flex-auto">
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-sm font-bold tracking-tight ${index === selectedIndex ? 'text-white' : 'text-zinc-300'}`}>
                                                        {item.label}
                                                    </p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${item.type === 'NAV' ? 'text-zinc-500 border-zinc-800' :
                                                        item.type === 'PROJECT' ? 'text-brand-400 border-brand-500/20 bg-brand-500/5' :
                                                            'text-purple-400 border-purple-500/20 bg-purple-500/5'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                {item.sublabel && (
                                                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5 uppercase tracking-tighter italic">
                                                        {item.sublabel}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : query.length >= 2 ? (
                                <div className="px-6 py-20 text-center">
                                    <div className="mx-auto h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-800 mb-6 border border-white/5">
                                        <Sparkles size={24} />
                                    </div>
                                    <p className="text-zinc-300 font-bold text-base">No intelligence found</p>
                                    <p className="mt-2 text-zinc-500 text-sm font-medium">Your search query returned zero nodes.</p>
                                </div>
                            ) : (
                                <div className="px-6 py-6 border-t border-white/5 mt-2">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Recommended Directives</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {staticActions.map(action => (
                                            <button key={action.id} onClick={() => handleSelect(action)} className="flex items-center gap-3 p-3 bg-zinc-950 border border-white/5 rounded-xl hover:border-brand-500/30 transition-all group text-left">
                                                <div className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 group-hover:text-brand-400">
                                                    <action.icon size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between bg-zinc-950 px-6 py-4 text-[10px] font-bold text-zinc-600 border-t border-white/5 uppercase tracking-widest">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5"><kbd className="bg-zinc-900 border border-white/10 rounded px-1 min-w-[20px] text-center">↑</kbd><kbd className="bg-zinc-900 border border-white/10 rounded px-1 min-w-[20px] text-center">↓</kbd> Navigate</div>
                                <div className="flex items-center gap-1.5"><kbd className="bg-zinc-900 border border-white/10 rounded px-1 mx-1">Enter</kbd> Select</div>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500">
                                <Zap size={12} className="text-brand-500" /> Powered by Forge Search
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
