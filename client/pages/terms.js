import Layout from '../components/Layout';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-brand-500/30">
            {/* Header */}
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
                    <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Terms and Conditions</h1>
                    <p className="text-lg font-medium text-zinc-500 max-w-2xl mx-auto">
                        Please review these terms carefully before accessing or using the Nexus tracking system.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-6">
                        Last Updated: March 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            By accessing, registering for, or using the Nexus application ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions outlined in this agreement, then you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Account Registration</h2>
                        <ul className="list-disc list-inside text-zinc-400 leading-relaxed font-medium text-sm space-y-2">
                            <li>You must provide accurate, complete, and current registration information.</li>
                            <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                            <li>You must not disclose your password to any third party.</li>
                            <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User Data and Privacy</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            Your privacy is important to us. It is Nexus's policy to respect your privacy regarding any information we may collect from you across our application. We only retain collected information for as long as necessary to provide you with your requested service. We protect data using commercially acceptable means to prevent loss and theft.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            You agree not to engage in any of the following prohibited activities:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 leading-relaxed font-medium text-sm space-y-2 mt-2">
                            <li>Copying, distributing, or disclosing any part of the Service in any medium.</li>
                            <li>Attempting to interfere with, compromise the system integrity or security of the Service.</li>
                            <li>Uploading invalid data, viruses, worms, or other software agents.</li>
                            <li>Using the Service for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
                        <p className="text-zinc-400 leading-relaxed font-medium text-sm">
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
