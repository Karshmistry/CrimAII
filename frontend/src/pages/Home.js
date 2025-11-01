import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
      
      {/* Center Content Box */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-12 rounded-xl shadow-lg text-center border border-white/20">
          {/* Heading */}
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Crim<span className="text-sky-400">AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg mb-6">
            The future of Smart Crime Detection &{" "}
            <span className="text-indigo-400 font-semibold">Monitoring</span>
          </p>

          {/* Explore Button */}
          <button
            onClick={() => navigate("/explore")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            🚀 Explore
          </button>
        </div>
      </div>

      {/* Footer (page ke bilkul bottom me) */}
      <footer className="text-center py-4 text-gray-400 text-sm">
        ⚡ Powered by AI & ML
      </footer>
    </div>
  );
};

export default Home;
