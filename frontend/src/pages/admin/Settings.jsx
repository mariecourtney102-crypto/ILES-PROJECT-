import { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "",
    adminEmail: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8000/api/settings/")
      .then(res => setSettings(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put("http://localhost:8000/api/settings/", settings)
      .then(() => alert("Settings updated"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">
        Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block mb-1">Site Name</label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;