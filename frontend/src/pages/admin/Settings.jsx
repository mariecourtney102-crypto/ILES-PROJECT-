import { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("academic");
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    academic_year: "",
    semester: "",
    max_students_per_supervisor: "",
    submission_deadline: "",
    allow_late_submission: false,
  });

  // 🔄 FETCH FROM BACKEND
  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/settings/")
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ✏️ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 💾 SAVE TO BACKEND
  const handleSave = () => {
    axios.put("http://localhost:8000/api/admin/settings/", settings)
      .then(() => alert("Settings updated"))
      .catch(err => console.error(err));
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">System Settings</h1>

      {/* 🔥 TABS */}
      <div className="flex gap-4 mb-6 border-b">
        {["academic", "users", "submissions"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔥 CONTENT CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl">

        {/* 🎓 ACADEMIC */}
        {activeTab === "academic" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Academic Settings</h2>

            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Academic Year</label>
              <input
                type="text"
                name="academic_year"
                value={settings.academic_year}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Semester</label>
              <select
                name="semester"
                value={settings.semester}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </>
        )}

        {/* 👤 USERS */}
        {activeTab === "users" && (
          <>
            <h2 className="text-lg font-semibold mb-4">User Settings</h2>

            <div>
              <label className="block text-gray-600 mb-1">
                Max Students per Supervisor
              </label>
              <input
                type="number"
                name="max_students_per_supervisor"
                value={settings.max_students_per_supervisor}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </>
        )}

        {/* 📅 SUBMISSIONS */}
        {activeTab === "submissions" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Submission Settings</h2>

            <div className="mb-4">
              <label className="block text-gray-600 mb-1">
                Submission Deadline
              </label>
              <input
                type="date"
                name="submission_deadline"
                value={settings.submission_deadline}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="allow_late_submission"
                checked={settings.allow_late_submission}
                onChange={handleChange}
              />
              <label>Allow Late Submission</label>
            </div>
          </>
        )}

        {/* 💾 SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}