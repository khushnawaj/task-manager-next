import { useState } from "react";
import { useSignupMutation } from "../store/services/authApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { Zap, Shield, ArrowRight, Github, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, accessToken, organizations } = await signup(form).unwrap();
      dispatch(setAuth({ user, accessToken, organizations }));
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden font-sans selection:bg-brand-500/30">
      {/* GitHub Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-10"
      >
        <div className="mx-auto w-12 h-12 bg-white rounded-md flex items-center justify-center text-zinc-950 shadow-premium-lg mb-6">
          <UserPlus size={24} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Join Nexus
        </h2>
        <p className="mt-2 text-sm font-medium text-fg-muted">
          Start managing your projects with elite precision
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10 px-4"
      >
        <div className="bg-surface border border-border shadow-premium-xl rounded-lg p-8 sm:p-10 relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-md text-xs font-semibold text-center">
                {error?.data?.error || "Could not create account"}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-[10px] font-semibold text-fg-muted uppercase tracking-widest mb-2.5 ml-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                onChange={handleChange}
                className="input-field h-11"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-semibold text-fg-muted uppercase tracking-widest mb-2.5 ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="input-field h-11"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-semibold text-fg-muted uppercase tracking-widest mb-2.5 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
                className="input-field h-11"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start px-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 bg-background border-border rounded text-brand-500 focus:ring-0 mt-0.5"
              />
              <label htmlFor="terms" className="ml-3 block text-[10px] font-semibold text-fg-muted uppercase tracking-widest leading-relaxed">
                By signing up, I agree to the <a href="#" className="text-zinc-200 hover:text-brand-400">Terms</a> and <a href="#" className="text-zinc-200 hover:text-brand-400">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-semibold shadow-brand-500/10"
            >
              {isLoading ? "Creating account..." : "Create account"}
              <ArrowRight size={16} className="ml-1" />
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-widest">
                <span className="bg-surface px-4 text-fg-muted">Or join with</span>
              </div>
            </div>

            <button type="button" className="btn-secondary w-full h-11 text-xs font-semibold gap-3 transition-all">
              <Github size={18} className="text-white" />
              <span className="text-white">GitHub</span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-fg-muted">
            Already have an account? <Link href="/login" className="text-brand-500 hover:text-brand-400 font-semibold transition-colors">Login</Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-fg-muted opacity-50">
          <Shield size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Secure registration system</span>
        </div>
      </motion.div>
    </div>
  );
}
