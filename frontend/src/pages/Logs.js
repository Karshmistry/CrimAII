import React, { useEffect, useState } from "react";
import axios from "axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch logs from backend
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:5000/api/detections");
      setLogs(res.data.reverse()); // latest first
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchLogs();

    // ✅ OPTIONAL: Auto-refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black flex flex-col items-center pt-20 p-10 text-white">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Detection Logs 🧠</h2>
          <button
            onClick={fetchLogs}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all"
          >
            Refresh 🔄
          </button>
        </div>

        {lastUpdate && (
          <p className="text-sm text-gray-300 mb-4">
            Last updated at: {lastUpdate}
          </p>
        )}

        {loading ? (
          <p className="text-gray-300 animate-pulse">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400">No detections found yet.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className="bg-white/10 p-5 rounded-xl shadow-lg border border-white/10 hover:scale-[1.01] transition-all duration-200"
              >
                <h3 className="text-xl font-semibold text-yellow-300">
                  {log.criminal_name || "Unknown Criminal"}
                </h3>
                <p className="text-gray-200">
                  <strong>Crime:</strong> {log.criminal_details?.crime || "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong>Detected At:</strong>{" "}
                  {log.detected_at
                    ? new Date(log.detected_at).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-gray-400">
                  <strong>Source:</strong> {log.source || "Camera Feed"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
