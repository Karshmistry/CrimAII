import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, detectionsRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://127.0.0.1:5000/api/admin/detections', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(usersRes.data);
      setDetections(detectionsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data ❌");
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/admin/delete_user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const deleteDetection = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/admin/delete_detection/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete detection");
    }
  };

  if (loading) return <div className="text-center text-white mt-20">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">👑 Admin Dashboard</h1>

      {/* Users Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">All Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700 text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 border border-gray-600">Name</th>
                <th className="p-3 border border-gray-600">Email</th>
                <th className="p-3 border border-gray-600">Role</th>
                <th className="p-3 border border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-700">
                  <td className="p-3 border border-gray-700">{u.name}</td>
                  <td className="p-3 border border-gray-700">{u.email}</td>
                  <td className="p-3 border border-gray-700">{u.role}</td>
                  <td className="p-3 border border-gray-700">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Detections Section */}
      <section className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">All Detections</h2>
        {detections.length === 0 ? (
          <p className="text-gray-400">No detections found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700 text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 border border-gray-600">Criminal Name</th>
                <th className="p-3 border border-gray-600">Detected At</th>
                <th className="p-3 border border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((d) => (
                <tr key={d._id} className="hover:bg-gray-700">
                  <td className="p-3 border border-gray-700">{d.criminal_name || 'N/A'}</td>
                  <td className="p-3 border border-gray-700">{d.detected_at || 'N/A'}</td>
                  <td className="p-3 border border-gray-700">
                    <button
                      onClick={() => deleteDetection(d._id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
