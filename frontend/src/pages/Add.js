import React, { useState } from "react";
import axios from "axios";

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    age: "",
    gender: "",
    blood_group: "",
    crime_type: "",
    wanted_level: "",
    address: "",
    city: "",
    state: "",
    last_seen: "",
    details: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const res = await axios.post("http://127.0.0.1:5000/add_criminal", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "✅ Criminal added successfully!");
      setFormData({
        name: "",
        father_name: "",
        age: "",
        gender: "",
        blood_group: "",
        crime_type: "",
        wanted_level: "",
        address: "",
        city: "",
        state: "",
        last_seen: "",
        details: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding criminal. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black flex flex-col items-center pt-20 p-10 text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
        ➕ Add New Criminal Record
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl bg-white/10 p-8 rounded-2xl shadow-lg"
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white"
          required
        />
        <input
          type="text"
          name="father_name"
          placeholder="Father's Name"
          value={formData.father_name}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white"
        />

        {/* Gender Dropdown */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white border border-white"
        >
          <option value="">Gender</option>
          <option className="text-blue-400 bg-black">Male</option>
          <option className="text-pink-400 bg-black">Female</option>
          <option className="text-purple-400 bg-black">Other</option>
        </select>

        {/* Blood Group Dropdown */}
        <select
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white border border-white"
        >
          <option value="">Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
            <option
              key={bg}
              className="bg-black text-blue-300 hover:text-indigo-400"
            >
              {bg}
            </option>
          ))}
        </select>

        {/* Crime Type Dropdown */}
        <select
          name="crime_type"
          value={formData.crime_type}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white border border-white"
        >
          <option value="">Crime Type</option>
          {[
            "Murder",
            "Robbery",
            "Cyber Crime",
            "Fraud",
            "Kidnapping",
            "Smuggling",
            "Assault",
            "Drug Dealing",
            "Traffic Rule Break",

          ].map((crime) => (
            <option
              key={crime}
              className="bg-black text-red-400 hover:text-red-500"
            >
              {crime}
            </option>
          ))}
        </select>

        {/* Wanted Level Dropdown */}
        <select
          name="wanted_level"
          value={formData.wanted_level}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white border border-white"
        >
          <option value="">Wanted Level</option>
          <option className="bg-black text-green-400">Low</option>
          <option className="bg-black text-yellow-400">Medium</option>
          <option className="bg-black text-red-500">High</option>
        </select>

        {/* Address and Location */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white col-span-2"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white"
        />

        <input
          type="text"
          name="last_seen"
          placeholder="Last Seen (Date/Location)"
          value={formData.last_seen}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white col-span-2"
        />

        <textarea
          name="details"
          placeholder="Additional Details / Notes"
          value={formData.details}
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white placeholder-white col-span-2"
        ></textarea>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="p-3 rounded bg-white/20 text-white col-span-2"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 px-6 py-3 rounded-lg font-semibold transition ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Criminal Record"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-lg font-semibold ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Add;
