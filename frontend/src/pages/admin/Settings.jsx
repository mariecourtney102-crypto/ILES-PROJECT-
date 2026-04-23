import DashboardLayout from "../../Components/dashboard_layout";

function Settings() {
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600">Configure system-wide settings here.</p>
          {/* Add settings options here */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;