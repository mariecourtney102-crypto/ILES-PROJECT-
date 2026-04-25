import React from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useAuth } from "../../context/AuthContext";
import { useLogs } from "../../context/LogContext";
import { CheckCircle, Clock, Users, FileText, XCircle } from "lucide-react";

function SupervisorDashboard() {
  const { user } = useAuth();
  const { logs, loading, error } = useLogs();

  const pendingLogs = logs.filter((log) => log.status === "pending").length;
  const approvedLogs = logs.filter((log) => log.status === "approved").length;
  const rejectedLogs = logs.filter((log) => log.status === "rejected").length;
  const logsNeedingReview = logs.filter((log) => log.status === "pending");

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="max-w-6xl">
        <div className="mb-6 rounded-lg border-l-4 border-teal-600 bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <Users size={24} className="text-teal-600" />
            Profile Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user?.name || user?.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold capitalize text-gray-800">{user?.role || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Logs</p>
              <p className="font-semibold text-gray-800">{logs.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 text-yellow-600" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900">Pending Review</h3>
                <p className="text-2xl font-bold text-yellow-700">{pendingLogs}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-green-400 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 text-green-600" size={20} />
              <div>
                <h3 className="font-semibold text-green-900">Approved Logs</h3>
                <p className="text-2xl font-bold text-green-700">{approvedLogs}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 text-red-600" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Rejected Logs</h3>
                <p className="text-2xl font-bold text-red-700">{rejectedLogs}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <FileText size={24} className="text-teal-600" />
            Weekly Logs Review Panel
          </h2>

          {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          {loading ? (
            <p className="py-6 text-gray-500">Loading assigned student logs...</p>
          ) : logsNeedingReview.length > 0 ? (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {logsNeedingReview.map((log) => (
                <div key={log.id} className="rounded-lg border p-4 transition hover:bg-gray-50">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{log.student_name}</p>
                      <p className="text-sm text-gray-500">Week {log.week_number}</p>
                      <p className="text-sm text-gray-600">{log.description}</p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Submitted {new Date(log.date_submitted).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-gray-500">No pending logs from assigned students.</p>
          )}
        </div>

        <div className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white shadow-md">
          <h3 className="mb-4 text-lg font-bold">Dashboard Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-teal-100">Total Logs</p>
              <p className="text-3xl font-bold">{logs.length}</p>
            </div>
            <div>
              <p className="text-teal-100">Pending Review</p>
              <p className="text-3xl font-bold">{pendingLogs}</p>
            </div>
            <div>
              <p className="text-teal-100">Completion Rate</p>
              <p className="text-3xl font-bold">
                {logs.length > 0 ? Math.round(((approvedLogs + rejectedLogs) / logs.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupervisorDashboard;
