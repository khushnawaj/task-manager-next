import { useState } from "react";
import { useSignupMutation } from "../store/services/authApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-brand-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-display font-semibold text-brand-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-brand-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-900 hover:text-brand-700 underline transition-colors">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 shadow-sm border border-brand-100 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error?.data?.error || "Error signing up"}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  className="input-field"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-700 mb-1">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-brand-900 focus:ring-brand-900 border-brand-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-brand-500">
                I agree to the <a href="#" className="font-medium text-brand-700 hover:underline">Terms</a> and <a href="#" className="font-medium text-brand-700 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
