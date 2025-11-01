import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Input field handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Signup submit handler
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      console.log("🟢 Sending data to backend:", form); // debug line
      const res = await axios.post("http://localhost:5000/api/auth/signup", form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("🟢 Response from backend:", res.data);

      if (res.status === 201) {
        alert("✅ Signup successful! Please login now.");
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-lg text-center border border-white/20 w-[400px]">
        <h1 className="text-4xl font-bold text-white mb-6">Create Account</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            🚀 Sign Up
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
