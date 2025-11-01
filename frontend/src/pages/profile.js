import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSignOutAlt,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ Fetch user details using token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // 🔒 Token check
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // ✅ axios version
        const res =  await axios.get("http://127.0.0.1:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Update user details in backend
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.updated_user || user);
        setMessage({ type: "success", text: "Profile updated successfully ✅" });
        setEditMode(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "Update failed ❌" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error ❌" });
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // ✅ Format join date
  const formattedJoinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        className="max-w-3xl w-full bg-gray-800 rounded-3xl shadow-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          👮‍♂️ CrimAI User Profile
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FaUser className="text-blue-400" />
              <span className="font-semibold">Name</span>
            </div>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="bg-gray-700 px-2 py-1 rounded text-white w-40"
              />
            ) : (
              <span>{user.name || "Loading..."}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-green-400" />
              <span className="font-semibold">Email</span>
            </div>
            <span>{user.email}</span>
          </div>

          {/* Phone */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FaPhone className="text-yellow-400" />
              <span className="font-semibold">Phone</span>
            </div>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="bg-gray-700 px-2 py-1 rounded text-white w-40"
              />
            ) : (
              <span>{user.phone || "N/A"}</span>
            )}
          </div>

          {/* Join Date */}
          <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-pink-400" />
              <span className="font-semibold">Joined</span>
            </div>
            <span>{formattedJoinDate || "—"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          {editMode ? (
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl"
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl"
            >
              <FaEdit /> Edit
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-xl"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Floating message */}
        {message && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl ${
              message.type === "success"
                ? "bg-green-700"
                : message.type === "error"
                ? "bg-red-700"
                : "bg-gray-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </motion.div>
    </div>
  );
}
