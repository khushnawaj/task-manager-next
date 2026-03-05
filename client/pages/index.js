import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Zap, ArrowRight, Shield, Activity, Users, Layout as LayoutIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-brand-500/30 antialiased overflow-x-hidden relative font-sans">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-border backdrop-blur-md bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-950 shadow-premium-lg transition-transform group-hover:scale-105">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <span className="font-medium text-xl tracking-tight text-white">Forge</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40">
        <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-border mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Enterprise Task Management</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.05] mb-8">
              The next gen <br />
              <span className="text-zinc-500">productivity</span> <br />
              standard.
            </h1>

            <p className="text-lg text-zinc-500 max-w-lg mb-12 font-medium leading-relaxed">
              Track work, manage your team, and stay ahead of deadlines. Purpose-built for high-velocity engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-primary h-12 px-8 flex items-center justify-center gap-2 text-sm font-semibold shadow-brand-500/10 group">
                Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary h-12 px-8 flex items-center justify-center text-sm font-semibold">
                Request Demo
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-10 border-t border-border pt-10">
              {[
                { label: 'Workspaces', val: '2.4k' },
                { label: 'Uptime', val: '99.99%' },
                { label: 'Security', val: 'SOC-2' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-zinc-100">{stat.val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="relative bg-zinc-900/40 backdrop-blur-2xl border border-border rounded-[3rem] p-4 shadow-premium-xl rotate-3 hover:rotate-0 transition-all duration-700 group overflow-hidden">
              {/* Mock UI Layering */}
              <div className="bg-zinc-950 rounded-[2rem] overflow-hidden aspect-[4/3] border border-border shadow-inner relative">
                <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-900/50 border-b border-border flex items-center px-6 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                </div>
                <div className="mt-16 px-10 flex flex-col gap-8">
                  <div className="h-4 w-1/4 bg-zinc-800 rounded-full"></div>
                  <div className="h-10 w-full bg-zinc-900 rounded-xl border border-border"></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-zinc-900 border border-border rounded-2xl p-4 flex flex-col justify-end">
                      <div className="h-2 w-1/2 bg-zinc-800 rounded-full mb-2"></div>
                      <div className="h-1.5 w-1/4 bg-zinc-800/50 rounded-full"></div>
                    </div>
                    <div className="h-32 bg-brand-500/10 border border-brand-500/20 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Showcase */}
      <section className="bg-zinc-950 py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
              Engineered for velocity.
            </h2>
            <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-lg">
              Everything you need to orchestrate complex engineering workflows, delivered in a minimalist, zero-latency interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-border p-8 rounded-3xl hover:border-zinc-700 transition-colors group">
              <div className="h-12 w-12 bg-zinc-950 border border-border rounded-xl flex items-center justify-center text-brand-500 mb-8 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Real-time Synchronization</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Experience zero latency. State mutations propagate instantly across your organization's entire network via WebSocket architecture.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-border p-8 rounded-3xl hover:border-zinc-700 transition-colors group">
              <div className="h-12 w-12 bg-zinc-950 border border-border rounded-xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Enterprise RBAC</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Granular access controls allow you to define exactly who can view, mutate, or destroy resources down to the component level.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-border p-8 rounded-3xl hover:border-zinc-700 transition-colors group">
              <div className="h-12 w-12 bg-zinc-950 border border-border rounded-xl flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                <LayoutIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Advanced Analytics</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Identify deployment bottlenecks before they impact velocity. Measure operational throughput with high-fidelity telemetry.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-900 border border-border p-8 rounded-3xl hover:border-zinc-700 transition-colors group">
              <div className="h-12 w-12 bg-zinc-950 border border-border rounded-xl flex items-center justify-center text-rose-500 mb-8 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Team Sub-Routing</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Divide massive organizations into focused, tight-knit squads. Maintain isolated backlogs without losing high-level visibility.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="md:col-span-2 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 border border-brand-500/20 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex flex-col justify-center h-full">
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Ready to integrate?</h3>
                <p className="text-zinc-400 font-medium leading-relaxed max-w-md mb-8">
                  Join thousands of engineering teams that have already made the switch to Forge's precision-engineered platform.
                </p>
                <Link href="/signup" className="flex items-center gap-2 text-brand-400 font-semibold uppercase tracking-widest text-xs hover:text-brand-300 transition-colors">
                  Deploy Workspace <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-zinc-950 py-24 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-600 mb-16">Trusted by the world's most innovative teams</p>
          <div className="flex flex-wrap justify-center gap-x-24 gap-y-12 opacity-30 hover:opacity-60 transition-opacity duration-700">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">⚡ ELECTRA</div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">🛡️ AEGIS</div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">🌌 VOID</div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">💎 PRISM</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-zinc-950 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-zinc-950 shadow-premium-md">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">Forge</span>
          </div>
          <p className="text-xs font-medium text-zinc-600 tracking-wide">© 2026 Forge Infrastructure. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
