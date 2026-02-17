import Navbar from './Navbar';
import Head from 'next/head';
import CommandPalette from './CommandPalette';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

export default function Layout({ children, title, transparentNav = false }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{title ? `${title} | Nexus` : 'Nexus'}</title>
            </Head>
            <CommandPalette />
            <KeyboardShortcutsModal />
            <Navbar transparent={transparentNav} />
            <main className={`pt-16 min-h-screen`}>{children}</main>
        </div>
    );
}
