import { useEffect, useState } from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+/ or Cmd+/ to toggle
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const shortcuts = [
        {
            category: 'Navigation',
            items: [
                { keys: ['Ctrl', 'K'], description: 'Open command palette' },
                { keys: ['Ctrl', 'N'], description: 'Create new task' },
                { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
                { keys: ['Esc'], description: 'Close modal or clear selection' },
            ]
        },
        {
            category: 'Task Actions',
            items: [
                { keys: ['E'], description: 'Edit selected task' },
                { keys: ['D'], description: 'Mark task as done' },
                { keys: ['A'], description: 'Assign task to me' },
                { keys: ['Delete'], description: 'Archive task (soft delete)' },
            ]
        },
        {
            category: 'Views',
            items: [
                { keys: ['1'], description: 'Switch to Board view' },
                { keys: ['2'], description: 'Switch to List view' },
                { keys: ['3'], description: 'Switch to Dashboard view' },
                { keys: ['4'], description: 'Switch to Workload view' },
            ]
        }
    ];

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
                        className="relative z-[110] mx-auto mt-20 max-w-2xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                                    <Keyboard className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {shortcuts.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        {section.category}
                                    </h3>
                                    <div className="space-y-2">
                                        {section.items.map((shortcut, itemIdx) => (
                                            <div key={itemIdx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <span className="text-sm text-gray-700">{shortcut.description}</span>
                                                <div className="flex items-center gap-1">
                                                    {shortcut.keys.map((key, keyIdx) => (
                                                        <span key={keyIdx} className="inline-flex items-center">
                                                            <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 font-mono text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded shadow-sm">
                                                                {key}
                                                            </kbd>
                                                            {keyIdx < shortcut.keys.length - 1 && (
                                                                <span className="mx-1 text-gray-400">+</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Press <kbd className="font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 mx-1">Ctrl</kbd> +
                                <kbd className="font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 mx-1">/</kbd> anytime to toggle this panel
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
