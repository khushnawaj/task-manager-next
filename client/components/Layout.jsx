import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Head from 'next/head';
import CommandPalette from './CommandPalette';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, title }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-fg-default font-sans selection:bg-brand-500/30 antialiased">
            <Head>
                <title>{title ? `${title} | Forge` : 'Forge'}</title>
            </Head>

            {/* Desktop & Mobile Navigation Controller */}
            <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <CommandPalette />
            <KeyboardShortcutsModal />

            <main className="min-h-[calc(100vh-64px)] relative">
                <div className="relative z-10 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
