import { useEffect, useState } from "react";
import api, { changePassword } from "../../api/api";
import DashboardLayout from "../../Components/dashboard_layout";

const emptyPasswordForm = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [settings, setSettings] = useState({
    siteName: "",
    adminEmail: "",
  });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

  useEffect(() => {
    api
      .get("/settings/")
      .then((res) => {
        setSettings({
          siteName: res.data.siteName || "",
          adminEmail: res.data.adminEmail || "",
        });
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load settings.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/settings/", settings);
      setSettings({
        siteName: response.data.siteName || "",
        adminEmail: response.data.adminEmail || "",
      });
      setSuccess("Settings updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const response = await changePassword(passwordForm);
      setPasswordSuccess(response.message || "Password changed successfully.");
      setPasswordForm(emptyPasswordForm);
    } catch (err) {
      const responseError = err.response?.data?.error;
      setPasswordError(
        Array.isArray(responseError)
          ? responseError.join(" ")
          : responseError || "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Site Settings</h2>

          {loading ? (
            <p className="py-10 text-sm text-gray-500">Loading settings...</p>
          ) : (
            <form onSubmit={handleSettingsSubmit} className="mt-6 space-y-5">
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              ) : null}

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Site Name</span>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleSettingsChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Admin Email</span>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleSettingsChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
            {passwordError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordError}
              </div>
            ) : null}

            {passwordSuccess ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {passwordSuccess}
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Current Password</span>
              <input
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">New Password</span>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Confirm New Password</span>
              <input
                type="password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </label>

            <button
              type="submit"
              disabled={changingPassword}
              className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
