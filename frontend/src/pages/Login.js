import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
         localStorage.setItem("token", data.token); // Token save
         localStorage.setItem("email", email); // ✅ Save user email for profile
        localStorage.setItem("token", data.token); // Token save
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-lg text-center border border-white/20 w-[400px]">
        <h1 className="text-4xl font-bold text-white mb-6">
          Login to <span className="text-sky-400">Crim</span>
          <span className="text-purple-400">AI</span>
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-white/20 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-white/20 text-white"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-sky-400 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
