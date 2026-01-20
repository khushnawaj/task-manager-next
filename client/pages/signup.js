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
      router.push("/dashboard"); // Redirect to dashboard after signup
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Join the Future
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error?.data?.error || "Error signing up"}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Elon Musk"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="elon@mars.com"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 rounded transition-transform transform hover:scale-[1.02]"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
