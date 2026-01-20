import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children, title, transparentNav = false }) {
    return (
        <div className="min-h-screen">
            <Head>
                <title>{title ? `${title} | Nexus` : 'Nexus'}</title>
            </Head>
            <Navbar transparent={transparentNav} />
            <main className={`pt-16 min-h-screen`}>{children}</main>
        </div>
    );
}
