import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-indigo-900 to-black px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Left Side - Logo */}
      <h1 className="text-2xl font-bold text-white">
        Crim<span className="text-blue-400">AI</span>
      </h1>

      {/* Center Navigation */}
      <div className="space-x-6 flex items-center">
        <Link to="/home" className="text-gray-200 hover:text-blue-400">
          Home
        </Link>
        <Link to="/explore" className="text-gray-200 hover:text-blue-400">
          Explore
        </Link>
        <Link to="/logs" className="text-gray-200 hover:text-blue-400">
          Logs
        </Link>
        <Link to="/add" className="text-gray-200 hover:text-blue-400">
          Add
        </Link>
        <Link to="/detect" className="text-gray-200 hover:text-blue-400">
          Detect
        </Link>
        <Link to="/admin" className="text-gray-200 hover:text-blue-400">
          Admin
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className="ml-4">
          <FaUserCircle className="text-3xl text-gray-200 hover:text-blue-400" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
