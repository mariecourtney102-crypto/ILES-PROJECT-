import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteWeeklyLog } from "../../api/api";

function WeeklyLogs() {
  const { logs, loading, error, loadLogs } = useLogs();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getStatusClasses = (status) => {
    if (status === "draft") {
      return "bg-gray-100 text-gray-700";
    }

    if (status === "approved") {
      return "bg-[#d1fae5] text-[#0a7c6e]";
    }

    if (status === "evaluated") {
      return "bg-[#ecfdf5] text-[#065f52]";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-[#ecfdf5] text-[#065f52]";
  };

  const handleDeleteLog = async (logId) => {
    setDeleting(true);
    try {
      await deleteWeeklyLog(logId);
      // Refresh logs after deletion
      await loadLogs();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting log:", err);
      alert("Failed to delete log: " + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
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

            <div className="mt-4 flex flex-wrap gap-2">
              {log.status === "draft" ? (
                <Link
                  to={`/submitlog/${log.id}`}
                  className="inline-flex rounded-lg border border-[#0d9e8c] px-4 py-2 text-sm font-semibold text-[#0a7c6e] transition hover:bg-[#f1fbf8]"
                >
                  Edit Draft
                </Link>
              ) : null}

              {(log.status === "draft" || log.status === "pending") ? (
                <button
                  onClick={() => setDeleteConfirm(log.id)}
                  className="inline-flex rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete Log
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900">Delete Weekly Log?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this log? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLog(deleteConfirm)}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default WeeklyLogs;
