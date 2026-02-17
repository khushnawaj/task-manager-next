import { useRouter } from 'next/router';
import { useGetSubscriptionStatusQuery, useCreateCheckoutSessionMutation } from '../../../store/services/billingApi';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Shield, Zap, Check, ArrowLeft, CreditCard, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BillingPage() {
    const router = useRouter();
    const { id: organizationId } = router.query;

    const { data: status, isLoading } = useGetSubscriptionStatusQuery(organizationId, { skip: !organizationId });
    const [createCheckout, { isLoading: isUpgrading }] = useCreateCheckoutSessionMutation();

    const handleUpgrade = async () => {
        try {
            const { url } = await createCheckout({ organizationId, planId: 'pro' }).unwrap();
            window.location.href = url;
        } catch (err) {
            alert('Upgrade failed');
        }
    };

    if (isLoading) return (
        <Layout title="Billing">
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Validating subscription nodes...</p>
            </div>
        </Layout>
    );

    const isPro = status?.plan === 'pro';

    return (
        <Layout title="Billing & Plans">
            <div className="max-w-6xl mx-auto py-12">
                {/* Header Section */}
                <div className="mb-16">
                    <Link href={`/organizations/${organizationId}`} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Workspace Access
                    </Link>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center text-brand-500 mb-6 shadow-inner">
                            <CreditCard size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            {isPro ? "Professional Infrastructure Active" : "Infrastructure Scaling"}
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl font-medium">
                            Configure your organizational resources.
                            {isPro ? " Your workspace is currently operating with priority AI allocation." : " Select a tier to unlock advanced orchestration and AI directives."}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-10 rounded-3xl border flex flex-col transition-all relative ${isPro
                                ? 'border-border bg-active/5 opacity-50'
                                : 'border-active bg-zinc-900 shadow-premium-lg'
                            }`}
                    >
                        <div className="mb-10">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                                <Shield size={12} /> Starter Node
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white tracking-tighter">$0</span>
                                <span className="text-zinc-500 font-semibold text-sm">/mo</span>
                            </div>
                        </div>

                        <div className="space-y-5 mb-12 flex-1">
                            {[
                                "3 Active Projects",
                                "50 Synchronized Tasks",
                                "Basic Node Support",
                                "Standard Logic Processing"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-medium">
                                    <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button disabled className="w-full h-12 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-white/5">
                            {isPro ? "Downgrade restricted" : "Default initialization"}
                        </button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`relative p-[1px] rounded-3xl overflow-hidden ${isPro ? 'bg-zinc-800 border border-border/50' : 'bg-gradient-to-br from-brand-500/50 via-purple-500/50 to-brand-500/50 animate-glow'
                            }`}
                    >
                        <div className="bg-zinc-900 rounded-[23px] h-full p-10 flex flex-col relative overflow-hidden">
                            {!isPro && (
                                <div className="absolute top-0 right-0 bg-brand-500 text-white text-[9px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em] shadow-premium-sm z-20">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-10 relative z-10">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-3">
                                    <Sparkles size={12} /> Professional Tier
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white tracking-tighter">$29</span>
                                    <span className="text-zinc-500 font-semibold text-sm">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-5 mb-12 flex-1 relative z-10">
                                {[
                                    { text: "Unlimited Project Clusters", active: true },
                                    { text: "Unbounded Task Orchestration", active: true },
                                    { text: "Priority Node Support", active: true },
                                    { text: "AI Architecture Directives (Gemini)", active: true, premium: true }
                                ].map((feature, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-sm font-semibold ${feature.premium ? 'text-brand-400' : 'text-white'}`}>
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs shadow-premium-sm ${feature.premium
                                                ? 'bg-brand-500 text-white'
                                                : 'bg-brand-500/10 text-brand-400'
                                            }`}>
                                            {feature.premium ? <Star size={10} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                                        </div>
                                        {feature.text}
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 pt-4">
                                {isPro ? (
                                    <div className="w-full h-12 rounded-xl bg-success/10 text-success border border-success/20 flex items-center justify-center text-xs font-bold uppercase tracking-widest">
                                        Active Deployment
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isUpgrading}
                                        className="w-full h-12 btn-primary text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-brand-500/30"
                                    >
                                        {isUpgrading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : "Scale Infrastructure"}
                                    </button>
                                )}
                            </div>

                            {/* Background Effects */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px]" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
