import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({
    siteName: "",
    adminEmail: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Site Name</label>
          <input
            type="text"
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            value={form.adminEmail}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}