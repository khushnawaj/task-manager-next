import { useRouter } from 'next/router';
import { useGetSubscriptionStatusQuery, useCreateCheckoutSessionMutation } from '../../../store/services/billingApi';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function BillingPage() {
    const router = useRouter();
    const { id: organizationId } = router.query;

    const { data: status, isLoading } = useGetSubscriptionStatusQuery(organizationId, { skip: !organizationId });
    const [createCheckout, { isLoading: isUpgrading }] = useCreateCheckoutSessionMutation();

    const handleUpgrade = async () => {
        try {
            const { url } = await createCheckout({ organizationId, planId: 'pro' }).unwrap();
            window.location.href = url; // or router.push if internal
        } catch (err) {
            alert('Upgrade failed');
        }
    };

    if (isLoading) return <Layout title="Billing"><div className="text-white p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div></div></Layout>;

    const isPro = status?.plan === 'pro';

    return (
        <Layout title="Billing & Plans">
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/organizations/${organizationId}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-4">
                        &larr; Back to Workspace
                    </Link>
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {isPro ? "You are on the PRO Plan 🚀" : "Choose Your Plan"}
                        </h1>
                        <p className="text-slate-400 text-lg">Unlock the full power of Nexus with AI-driven workflows and unlimited collaboration.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className={`p-8 rounded-3xl border ${isPro ? 'border-white/5 bg-slate-900/30 opacity-50' : 'border-indigo-500/30 bg-slate-900/50 ring-1 ring-indigo-500/30'} flex flex-col backdrop-blur-sm transition-all`}>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-300">Starter</h2>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-slate-500">/forever</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-slate-300"><span className="text-emerald-400">✓</span> 3 Projects</li>
                            <li className="flex items-center gap-3 text-slate-300"><span className="text-emerald-400">✓</span> 50 Tasks</li>
                            <li className="flex items-center gap-3 text-slate-300"><span className="text-emerald-400">✓</span> Basic Support</li>
                            <li className="flex items-center gap-3 text-slate-600"><span className="text-slate-700">✕</span> AI Director</li>
                        </ul>
                        <button disabled className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl font-bold cursor-not-allowed border border-slate-700">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`relative p-1 rounded-3xl ${isPro ? 'bg-slate-800' : 'bg-gradient-to-b from-indigo-500 to-purple-600'}`}>
                        <div className="bg-slate-900 rounded-[22px] h-full p-8 flex flex-col relative overflow-hidden">
                            {!isPro && <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">Most Popular</div>}

                            <div className="mb-6 relative z-10">
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</h2>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$29</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 relative z-10">
                                <li className="flex items-center gap-3 text-white"><span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span> Unlimited Projects</li>
                                <li className="flex items-center gap-3 text-white"><span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span> Unlimited Tasks</li>
                                <li className="flex items-center gap-3 text-white"><span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span> Priority Support</li>
                                <li className="flex items-center gap-3 text-white font-semibold">
                                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs shadow-lg shadow-purple-500/50">✨</span>
                                    AI Director (Gemini)
                                </li>
                            </ul>

                            <div className="relative z-10">
                                {isPro ? (
                                    <button disabled className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl font-bold">
                                        Plan Active
                                    </button>
                                ) : (
                                    <button onClick={handleUpgrade} disabled={isUpgrading} className="w-full btn-primary py-3 rounded-xl font-bold transition-all hover:scale-[1.02]">
                                        {isUpgrading ? "Processing..." : "Upgrade to Pro"}
                                    </button>
                                )}
                            </div>

                            {/* Background Glow */}
                            <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Enable SSR for authenticated routes
export async function getServerSideProps() {
    return { props: {} };
}
