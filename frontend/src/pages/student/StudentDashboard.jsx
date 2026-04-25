import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function StudentDashboard() {
  const { logs, loading, error } = useLogs();
  const pending = logs.filter((log) => log.status === "pending").length;
  const approved = logs.filter((log) => log.status === "approved").length;
  const rejected = logs.filter((log) => log.status === "rejected").length;

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500">Pending Logs</h3>
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500">Approved Logs</h3>
          <p className="text-2xl font-bold text-green-500">{approved}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-gray-500">Rejected Logs</h3>
          <p className="text-2xl font-bold text-red-500">{rejected}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Recent Logs</h3>
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        {loading ? <p className="text-gray-500">Loading logs...</p> : null}
        {!loading && logs.length === 0 ? <p className="text-gray-500">No logs submitted yet.</p> : null}
        {!loading &&
          logs
            .slice(-5)
            .reverse()
            .map((log) => (
              <div key={log.id} className="border-b py-2 last:border-b-0">
                <p className="font-medium text-gray-800">Week {log.week_number}</p>
                <p>{log.description}</p>
                <span className="text-sm text-gray-500">{log.status}</span>
              </div>
            ))}
      </div>
    </DashboardLayout>
  );
}
export default StudentDashboard;
