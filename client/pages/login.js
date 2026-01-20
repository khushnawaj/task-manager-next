import { useState } from "react";
import { useLoginMutation } from "../store/services/authApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error?.data?.error || "Invalid credentials"}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-green-500 transition-colors"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-2 rounded transition-transform transform hover:scale-[1.02]"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400 text-sm">
          No account? <Link href="/signup" className="text-green-400 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
