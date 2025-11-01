import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Logs from "./pages/Logs";
import Add from "./pages/Add";
import Detect from "./pages/Detect";
import Welcome from "./pages/welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Article from "./pages/NewsArticle"; 
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome Screen (No Navbar) */}
        <Route path="/" element={<Welcome />} />

        {/* Auth Pages (No Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard (✅ New Route) */}
        <Route
          path="/admin"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
              <Navbar />
              <AdminDashboard />
            </div>
          }
        />

        {/* Pages with Navbar */}
        <Route
          path="/home"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Home />
            </div>
          }
        />
        <Route
          path="/explore"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Explore />
            </div>
          }
        />
        <Route
          path="/logs"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Logs />
            </div>
          }
        />
        <Route
          path="/add"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Add />
            </div>
          }
        />
        <Route
          path="/detect"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Detect />
            </div>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Profile />
            </div>
          }
        />

        {/* Full Article Page */}
        <Route
          path="/article/:id"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
              <Navbar />
              <Article />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
