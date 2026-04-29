import { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("academic");
  const [loading, setLoading] = useState(true);

  const ToggleSwitch = ({ name, checked, onChange }) => {
  return (
    <div
      onClick={() =>
        onChange({
          target: { name, type: "checkbox", checked: !checked },
        })
      }
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
        checked ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
};

  const [settings, setSettings] = useState({
    academic_year: "",
    semester: "",
    max_students_per_supervisor: "",
    submission_deadline: "",
    allow_late_submission: false,
    allow_registration: false,
    require_approval: false,
    grading_scale: "percentage",
  pass_mark: 50,
  enable_supervisor_grading: true,

  email_notifications: true,
  notify_on_submission: true,
  notify_supervisor_assignment: true,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    axios.put("http://localhost:8000/api/admin/settings/", settings)
      .then(() => alert("Settings updated"))
      .catch(err => console.error(err));
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  const tabs = [
    { id: "academic", label: "Academic" },
    { id: "users", label: "Users" },
    { id: "submissions", label: "Submissions" },
    { id: "grading", label: "Grading" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-6 text-primary">Settings</h2>

        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "hover:bg-teal-50 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔥 CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-semibold mb-6 capitalize">
          {activeTab} Settings
        </h1>

        <div className="grid gap-6 max-w-3xl">

          {/* 🎓 ACADEMIC */}
          {activeTab === "academic" && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Academic Structure</h2>

              <div className="mb-4">
                <label className="block mb-1 text-gray-600">Academic Year</label>
                <input
                  type="text"
                  name="academic_year"
                  value={settings.academic_year}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Semester</label>
                <select
                  name="semester"
                  value={settings.semester}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">Select semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            </div>
          )}

          {/* 👤 USERS */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">User Management</h2>

              <div className="mb-4">
                <label className="block mb-1 text-gray-600">
                  Max Students per Supervisor
                </label>
                <input
                  type="number"
                  name="max_students_per_supervisor"
                  value={settings.max_students_per_supervisor}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              {/* Toggle switches */}
             <div className="flex justify-between items-center mb-4">
  <span>Allow Registration</span>
  <ToggleSwitch
    name="allow_registration"
    checked={settings.allow_registration}
    onChange={handleChange}
  />
</div>

<div className="flex justify-between items-center">
  <span>Require Admin Approval</span>
  <ToggleSwitch
    name="require_approval"
    checked={settings.require_approval}
    onChange={handleChange}
  />
</div>
            </div>
          )}

          {/* 📅 SUBMISSIONS */}
          {activeTab === "submissions" && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Submission Rules</h2>

              <div className="mb-4">
                <label className="block mb-1 text-gray-600">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  name="submission_deadline"
                  value={settings.submission_deadline}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Allow Late Submission</span>
                <input
                  type="checkbox"
                  name="allow_late_submission"
                  checked={settings.allow_late_submission}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {activeTab === "grading" && (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-lg font-semibold mb-4">Grading Settings</h2>

    <div className="mb-4">
      <label className="block mb-1 text-gray-600">Grading Scale</label>
      <select
        name="grading_scale"
        value={settings.grading_scale}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      >
        <option value="percentage">Percentage (%)</option>
        <option value="letter">Letter (A–F)</option>
      </select>
    </div>

    <div className="mb-4">
      <label className="block mb-1 text-gray-600">Pass Mark</label>
      <input
        type="number"
        name="pass_mark"
        value={settings.pass_mark}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />
    </div>

    <div className="flex justify-between items-center">
      <span>Enable Supervisor Grading</span>
      <ToggleSwitch
        name="enable_supervisor_grading"
        checked={settings.enable_supervisor_grading}
        onChange={handleChange}
      />
    </div>
  </div>
)}

          {/* 💾 SAVE */}
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition w-fit"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}