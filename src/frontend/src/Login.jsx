import { useState } from "react";
import axios from "axios";

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
        await axios.post(
          "http://127.0.0.1:8000/auth/register",
          {
            name,
            email,
            password,
          }
        );

        setMessage("Registration successful. You can now login.");
        setIsRegister(false);
        setPassword("");
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/login",
          {
            email,
            password,
          }
        );

        const token = response.data.access_token;

        localStorage.setItem("token", token);

        onLogin();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            FinSight
          </h1>

          <p className="text-slate-400 mt-2">
            Understand Your Money. Manage Your Future.
          </p>

        </div>


        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-white">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-slate-400 text-sm mt-2 mb-6">
            {isRegister
              ? "Create your FinSight account."
              : "Login to access your financial dashboard."}
          </p>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {isRegister && (
              <div>

                <label className="text-sm text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />

              </div>
            )}


            <div>

              <label className="text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />

            </div>


            <div>

              <label className="text-sm text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />

            </div>


            {message && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                {message}
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </button>

          </form>


          {/* Switch */}
          <div className="text-center mt-6">

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Create one"}
            </button>

          </div>

        </div>


        <p className="text-center text-xs text-slate-600 mt-6">
          FinSight • Secure Personal Finance Platform
        </p>

      </div>

    </div>
  );
}

export default Login;