import { useState } from "react";
import { useLoginMutation } from "../store/services/authApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { Zap, Shield, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, accessToken, organizations } = await login(form).unwrap();
      dispatch(setAuth({ user, accessToken, organizations }));
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
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
          <Zap size={24} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm font-medium text-fg-muted">
          Login to your Nexus account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10 px-4"
      >
        <div className="bg-surface border border-border shadow-premium-xl rounded-lg p-8 sm:p-10 relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-md text-xs font-semibold text-center">
                {error?.data?.error || "Invalid email or password"}
              </div>
            )}

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
              <div className="flex items-center justify-between mb-2.5 ml-1">
                <label htmlFor="password" className="block text-[10px] font-semibold text-fg-muted uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-semibold text-brand-500 hover:text-brand-400 transition-colors uppercase tracking-widest">Forgot?</a>
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-semibold shadow-brand-500/10"
            >
              {isLoading ? "Signing in..." : "Login to account"}
              <ArrowRight size={16} className="ml-1" />
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-widest">
                <span className="bg-surface px-4 text-fg-muted">Or continue with</span>
              </div>
            </div>

            <button type="button" className="btn-secondary w-full h-11 text-xs font-semibold gap-3 transition-all">
              <Github size={18} className="text-white" />
              <span className="text-white">GitHub</span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-fg-muted">
            Don't have an account? <Link href="/signup" className="text-brand-500 hover:text-brand-400 font-semibold transition-colors">Sign up</Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-fg-muted opacity-50">
          <Shield size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Industry-grade security</span>
        </div>
      </motion.div>
    </div>
  );
}
