import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function WeeklyLogs() {
  const { logs, loading, error } = useLogs();

  const getStatusClasses = (status) => {
    if (status === "draft") {
      return "bg-gray-100 text-gray-700";
    }

    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <DashboardLayout title="Weekly Logs">
        <p className="text-gray-500">Loading weekly logs...</p>
      </DashboardLayout>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <DashboardLayout title="Weekly Logs">
        <p className="text-gray-500">No logs available yet.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Weekly Logs">
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-4">
        {logs.map((log) => (
          <div key={log.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <span className="font-semibold text-gray-800">Week {log.week_number}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(log.status)}`}>
                {log.status}
              </span>
            </div>

            <p className="text-gray-700">{log.description}</p>

            <div className="mt-3 text-sm text-gray-500">
              Submitted: {new Date(log.date_submitted).toLocaleString()}
            </div>

            {log.supervisor_name ? (
              <div className="mt-2 text-sm text-gray-600">Reviewed by: {log.supervisor_name}</div>
            ) : null}

            {log.supervisor_comment ? (
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-700">Supervisor Comment</p>
                <p className="mt-1 text-sm text-gray-600">{log.supervisor_comment}</p>
              </div>
            ) : null}

            {log.evaluation_score !== null && log.evaluation_score !== undefined ? (
              <div className="mt-2 text-sm text-gray-600">Score: {log.evaluation_score}</div>
            ) : null}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default WeeklyLogs;
