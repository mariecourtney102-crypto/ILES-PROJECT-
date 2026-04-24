import React, { useState } from "react";

const Settings = () => {
  const [formData, setFormData] = useState({
    siteName: "",
    adminEmail: "",
    password: "",
    notifications: false,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings Saved:", formData);
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold text-[#108395] mb-6">
        Admin Settings
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Site Name */}
          <div>
            <label className="block text-gray-600 mb-2">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              placeholder="Enter site name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108395]"
            />
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-gray-600 mb-2">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108395]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-2">Change Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#108395]"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <span className="text-gray-700">Enable Notifications</span>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="w-5 h-5 accent-[#108395]"
            />
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <span className="text-gray-700">Dark Mode</span>
            <input
              type="checkbox"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              className="w-5 h-5 accent-[#108395]"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#108395] text-white px-6 py-3 rounded-lg hover:bg-[#0e6e7c] transition duration-300"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;