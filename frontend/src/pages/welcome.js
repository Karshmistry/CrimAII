import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-12 rounded-xl shadow-lg text-center border border-white/20">
        
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Criminal <span className="text-sky-400">AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg mb-6">
          The future of Smart Crime Detection &{" "}
          <span className="text-indigo-400 font-semibold">Monitoring</span>
        </p>

        {/* Start Button → goes to Login */}
        <button 
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          🚀 Start Now
        </button>

      </div>

      {/* Footer outside the box */}
      <p className="absolute bottom-4 text-sm text-gray-400">
        ⚡ Powered by AI & ML
      </p>
    </div>
  );
};

export default Welcome;
