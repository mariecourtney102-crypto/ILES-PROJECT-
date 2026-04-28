import { useState } from "react";
import axiosInstance from "@/api/api";

function Settings() {
  const [password, setPassword] = useState("");

  const handlePasswordChange = async () => {
    try {
      await axiosInstance.post("/admin/change-password/", {
        password,
      });
      alert("Password updated");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700">Settings</h1>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={handlePasswordChange}
          className="mt-2 bg-teal-600 text-white px-4 py-2"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Settings;