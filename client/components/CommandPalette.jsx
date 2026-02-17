import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    Search, Command, ArrowRight, Zap, Target,
    Layout, CheckSquare, LogOut, Moon, Sun, Home,
    Briefcase
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function CommandPalette() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Toggle on Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Actions Definition
    const staticActions = [
        { id: 'my-tasks', label: 'Go to My Tasks', icon: CheckSquare, action: () => router.push('/my-tasks') },
        { id: 'dashboard', label: 'Go to Dashboard', icon: Layout, action: () => router.push('/dashboard') }, // Assuming global dashboard
        { id: 'projects', label: 'View All Projects', icon: Briefcase, action: () => router.push('/dashboard') },
    ];

    const filteredActions = staticActions.filter(a =>
        a.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (action) => {
        action.action();
        setIsOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => (i + 1) % filteredActions.length);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredActions[selectedIndex]) {
                handleSelect(filteredActions[selectedIndex]);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="relative z-[110] mx-auto mt-20 max-w-xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="flex items-center border-b border-gray-100 px-4 py-4">
                            <Search className="h-5 w-5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="block h-6 w-full border-none bg-transparent p-0 pl-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-0"
                                placeholder="Type a command or search..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex items-center gap-1">
                                <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-500">Esc</span>
                            </div>
                        </div>

                        {/* Dropdown List */}
                        {filteredActions.length > 0 && (
                            <ul className="max-h-96 scroll-py-2 overflow-y-auto p-2" id="options" role="listbox">
                                {filteredActions.map((action, index) => (
                                    <li
                                        key={action.id}
                                        className={`group flex cursor-pointer select-none items-center rounded-lg px-3 py-3 transition-colors ${index === selectedIndex ? 'bg-brand-50 text-brand-900' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        role="option"
                                        aria-selected={index === selectedIndex}
                                        onClick={() => handleSelect(action)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-md border ${index === selectedIndex ? 'bg-white border-brand-200 text-brand-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'
                                            }`}>
                                            <action.icon className="h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <div className="ml-4 flex-auto">
                                            <p className={`text-sm font-medium ${index === selectedIndex ? 'text-brand-900' : 'text-gray-700'}`}>
                                                {action.label}
                                            </p>
                                        </div>
                                        {index === selectedIndex && (
                                            <ArrowRight className="h-4 w-4 text-brand-400" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {filteredActions.length === 0 && (
                            <div className="px-6 py-14 text-center text-sm sm:px-14">
                                <Zap className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                <p className="mt-4 font-semibold text-gray-900">No commands found</p>
                                <p className="mt-2 text-gray-500">Try searching for 'dashboard' or 'tasks'.</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-500 border-t border-gray-100">
                            <span className="mr-2 font-medium">ProTip:</span> Use <kbd className="font-mono bg-white border border-gray-200 rounded px-1 mx-1">↑</kbd> <kbd className="font-mono bg-white border border-gray-200 rounded px-1 mx-1">↓</kbd> to navigate
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
