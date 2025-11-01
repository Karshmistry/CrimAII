// src/pages/Detect.js
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

const Detect = () => {
  const webcamRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [resultObj, setResultObj] = useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);

  function dataURLtoFile(dataurl, filename) {
    if (!dataurl) return null;
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const capture = () => {
    if (!webcamRef.current) return null;
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedDataUrl(imageSrc);
    return dataURLtoFile(imageSrc, "webcam_capture.jpg");
  };

  const uploadImageFile = async (file) => {
    if (!file) return;
    setIsDetecting(true);
    setResultObj(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API_BASE}/recognize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setResultObj(res.data || { message: "No response" });
    } catch (err) {
      console.error("uploadImageFile error:", err);
      setResultObj({ error: "Error contacting server" });
    } finally {
      setIsDetecting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCapturedDataUrl(reader.result);
    reader.readAsDataURL(file);
    uploadImageFile(file);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoSrc(URL.createObjectURL(file));
    setIsDetecting(true);
    setResultObj(null);
    const formData = new FormData();
    formData.append("video", file);
    try {
      const res = await axios.post(`${API_BASE}/recognize_video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000,
      });
      setResultObj(res.data || { message: "No response" });
    } catch (err) {
      console.error("handleVideoUpload error:", err);
      setResultObj({ error: "Video detection failed" });
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    let timer = null;
    if (autoDetect && showWebcam) {
      timer = setInterval(async () => {
        const file = capture();
        if (!file) return;
        setIsDetecting(true);
        try {
          const formData = new FormData();
          formData.append("image", file);
          const res = await axios.post(`${API_BASE}/recognize`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 120000,
          });
          setResultObj(res.data || { message: "No response" });
          if (res.data && res.data.match) {
            setAutoDetect(false);
          }
        } catch (err) {
          console.error("Auto-detect error:", err);
        } finally {
          setIsDetecting(false);
        }
      }, 2000);
    }
    return () => timer && clearInterval(timer);
  }, [autoDetect, showWebcam]);

  const handleManualDetect = async () => {
    const file = capture();
    if (!file) return;
    await uploadImageFile(file);
  };

  const matchedImageUrl = (filename) => {
    if (!filename) return null;
    return `${API_BASE}/faces_db/${encodeURIComponent(filename)}`;
  };

  const btnBase =
    "w-full text-white font-semibold px-6 py-4 rounded-2xl shadow-lg transition transform hover:scale-105";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-1 flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Actions</h2>
            <div className="space-y-4">
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label
                htmlFor="photoUpload"
                className={`${btnBase} bg-gradient-to-r from-blue-600 to-blue-500 cursor-pointer block text-center`}
              >
                Upload Photo
              </label>

              <input
                id="videoUpload"
                type="file"
                accept="video/mp4,video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <label
                htmlFor="videoUpload"
                className={`${btnBase} bg-gradient-to-r from-blue-600 to-blue-500 cursor-pointer block text-center`}
              >
                Upload Video
              </label>

              <button
                onClick={() => {
                  setShowWebcam((s) => !s);
                  if (showWebcam) setAutoDetect(false);
                }}
                className={`${btnBase} bg-gradient-to-r from-blue-600 to-blue-500 block`}
              >
                {showWebcam ? "Close Webcam" : "Use Live Webcam"}
              </button>

              {showWebcam && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/8">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg mb-3"
                    videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={capture} className="py-2 bg-white/10 text-white rounded-lg">
                      Capture
                    </button>
                    <button onClick={handleManualDetect} className="py-2 bg-white/10 text-white rounded-lg">
                      Detect
                    </button>
                    <button
                      onClick={() => setAutoDetect((s) => !s)}
                      className={`py-2 rounded-lg text-white ${autoDetect ? "bg-red-500" : "bg-green-500"}`}
                    >
                      {autoDetect ? "Stop Auto" : "Start Auto"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">
                    {isDetecting ? "Detecting..." : "Webcam ready"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white/6 rounded-2xl p-6 min-h-[400px] border border-white/10">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold text-white">Detection Panel</h2>
              <div className="text-sm text-gray-300">
                {isDetecting ? "Working..." : "Idle"}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: PREVIEW */}
              <div className="rounded-xl bg-black/50 p-4 flex flex-col items-center">
                <p className="text-sm text-gray-300 mb-2">Preview</p>
                {capturedDataUrl ? (
                  <img src={capturedDataUrl} alt="capture" className="w-full h-64 object-cover rounded-md shadow-md" />
                ) : videoSrc ? (
                  <video src={videoSrc} controls className="w-full h-64 object-cover rounded-md shadow-md" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center rounded-md border-dashed border-2 border-white/10">
                    <p className="text-gray-400">No preview yet — upload or capture</p>
                  </div>
                )}
              </div>

              {/* RIGHT: RESULT */}
              <div className="rounded-xl bg-black/60 p-4 text-white">
                <p className="text-sm text-gray-300 mb-2">Result</p>
                <h3 className="text-lg font-semibold">
                  {resultObj?.message || "No result yet"}
                </h3>
                {resultObj?.error && (
                  <p className="text-sm text-red-400 mt-2">{resultObj.error}</p>
                )}

                {/* ✅ Criminal Details Card */}
                {resultObj?.criminal_details && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xl font-bold text-yellow-400 mb-2">
                      ⚠️ Criminal Identified
                    </h4>
                    <div className="flex items-center space-x-4">
                      <img
                        src={`${API_BASE}/faces_db/${resultObj.criminal_details.image_filename}`}
                        alt="criminal"
                        className="w-24 h-24 object-cover rounded-lg border border-white/10"
                      />
                      <div className="text-sm space-y-1">
                        <div><span className="text-gray-300">👤 Name:</span> {resultObj.criminal_details.name}</div>
                        <div><span className="text-gray-300">🎂 Age:</span> {resultObj.criminal_details.age || "N/A"}</div>
                        <div><span className="text-gray-300">👨 Father:</span> {resultObj.criminal_details.father_name || "N/A"}</div>
                        <div><span className="text-gray-300">💉 Blood:</span> {resultObj.criminal_details.blood_group || "N/A"}</div>
                        <div><span className="text-gray-300">🏠 Address:</span> {resultObj.criminal_details.address || "N/A"}</div>
                        <div><span className="text-gray-300">🚨 Crime:</span> {resultObj.criminal_details.crime || "N/A"}</div>
                        <div><span className="text-gray-300">🕒 Detected:</span> {new Date().toLocaleString()}</div>
                      </div>
                    </div>
                    {resultObj.criminal_details.details && (
                      <div className="mt-3 text-xs text-gray-400 italic">
                        “{resultObj.criminal_details.details}”
                      </div>
                    )}
                  </div>
                )}

                {/* No match */}
                {resultObj && !resultObj.match && (
                  <div className="mt-4 text-sm text-gray-300">
                    No criminal match found in this check.
                  </div>
                )}
              </div>

              
            </div>

            <div className="mt-6 text-xs text-gray-400">
              Tip: Ensure your Flask backend serves <code>/faces_db/&lt;filename&gt;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detect;
