import Layout from '../components/Layout';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-brand-500/30">
            <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Nexus
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="text-brand-500" size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Legal Documentation</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20 pb-40">
                <div className="space-y-4 mb-20 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Privacy Policy</h1>
                    <p className="text-lg font-medium text-zinc-500 max-w-2xl mx-auto">
                        How we collect, use, and protect your data within the Nexus ecosystem.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-6">
                        Last Updated: March 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            We collect information to provide better services to our users. The types of information we collect include:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 leading-relaxed font-medium text-sm space-y-2 mt-2">
                            <li>Account Information (Name, Email Address).</li>
                            <li>Usage Data (Interaction history, preferences, and workspace analytics).</li>
                            <li>Device Information (Browser type, operating system, and IP address).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            We use the information we collect from all our services to provide, maintain, protect, and improve them, to develop new ones, and to protect Nexus and our users. We also use this information to offer you tailored content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            We work hard to protect Nexus and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 leading-relaxed font-medium text-sm space-y-2 mt-2">
                            <li>We encrypt many of our services using SSL.</li>
                            <li>We review our information collection, storage, and processing practices, including physical security measures.</li>
                            <li>We restrict access to personal information to Nexus employees, contractors, and agents who need to know that information in order to process it for us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Your Data Rights</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            You have the right to request access to the personal data we hold about you, to ask that your personal data be corrected, updated, or deleted. If you would like to exercise this right, please contact your workspace administrator or our support team.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
