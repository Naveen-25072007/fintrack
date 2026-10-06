import { useState } from "react";
import axios from "axios";

const API_URL = "https://finsight-api-dp50.onrender.com";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        // Register new user
        await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
        });

        setMessage("Registration successful! You can now login.");
        setIsRegister(false);
        setPassword("");
        setName("");
      } else {
        // Login existing user
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        const token = response.data.access_token;

        localStorage.setItem("token", token);

        onLogin();
      }
    } catch (error) {
      console.error("Authentication error:", error);

      setMessage(
        error.response?.data?.detail ||
          "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Fin<span className="text-blue-500">Sight</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Understand Your Money. Manage Your Future.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-slate-400 text-center mb-6">
            {isRegister
              ? "Create your FinSight account"
              : "Login to manage your finances"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - Register only */}
            {isRegister && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-center text-slate-300">
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold transition"
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          {/* Switch Login/Register */}
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage("");
                }}
                className="ml-2 text-blue-500 hover:text-blue-400 font-medium"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          FinSight • Personal Finance Management
        </p>
      </div>
    </div>
  );
}

export default Login;