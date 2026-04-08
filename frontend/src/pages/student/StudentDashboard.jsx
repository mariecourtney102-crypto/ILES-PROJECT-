import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function StudentDashboard() {
  const { logs } = useLogs();

  const total = logs.length;
  const pending = logs.filter(l => l.status === "pending").length;

  return (
    <DashboardLayout title="Student">

      <div className="grid grid-cols-2 gap-4">

        <div className="p-4 bg-white rounded-lg shadow">
          <h3>Total Logs</h3>
          <p className="text-xl font-bold">{total}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3>Pending</h3>
          <p className="text-xl font-bold text-yellow-500">{pending}</p>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default StudentDashboard;