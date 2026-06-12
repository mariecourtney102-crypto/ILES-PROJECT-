import React from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useAuth } from "../../context/AuthContext";
import { useLogs } from "../../context/LogContext";
import { CheckCircle, Clock, Users, FileText, XCircle } from "lucide-react";

function SupervisorDashboard() {
  const { user } = useAuth();
  const { logs, loading, error } = useLogs();

  const pendingLogs = logs.filter((log) => log.status === "pending").length;
  const approvedLogs = logs.filter((log) => log.status === "approved" || log.status === "evaluated").length;
  const rejectedLogs = logs.filter((log) => log.status === "rejected").length;
  const logsNeedingReview = logs.filter((log) => log.status === "pending");

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="max-w-6xl">
        <div className="mb-6 rounded-lg border-l-4 border-[#0a7c6e] bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <Users size={24} className="text-[#0a7c6e]" />
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
          <div className="rounded-lg border-l-4 border-[#0d9e8c] bg-[#f1fbf8] p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 text-[#0d9e8c]" size={20} />
              <div>
                <h3 className="font-semibold text-[#0a7c6e]">Pending Review</h3>
                <p className="text-2xl font-bold text-[#0a7c6e]">{pendingLogs}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-[#3db88a] bg-[#ecfdf5] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 text-[#3db88a]" size={20} />
              <div>
                <h3 className="font-semibold text-[#0a7c6e]">Approved Logs</h3>
                <p className="text-2xl font-bold text-[#0a7c6e]">{approvedLogs}</p>
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
            <FileText size={24} className="text-[#0a7c6e]" />
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
                    <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#0a7c6e]">
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
          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
  <h2 className="mb-4 text-xl font-bold text-gray-800">
    Student Evaluation
  </h2>

  <p className="text-sm text-gray-600">
    Evaluate assigned students based on:
  </p>

  <ul className="mt-2 list-disc pl-5 text-gray-700">
    <li>Technical Skills</li>
    <li>Cognitive Skills</li>
    <li>Soft Skills</li>
    <li>Professionalism</li>
  </ul>

  <button
    className="mt-4 rounded bg-[#0a7c6e] px-4 py-2 text-white"
  >
    Evaluate Student
  </button>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-[#0a7c6e] to-[#3db88a] p-6 text-white shadow-md">
            <h3 className="mb-4 text-lg font-bold">Dashboard Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/80">Total Logs</p>
                <p className="text-3xl font-bold">{logs.length}</p>
              </div>
              <div>
                <p className="text-white/80">Pending Review</p>
                <p className="text-3xl font-bold">{pendingLogs}</p>
              </div>
              <div>
                <p className="text-white/80">Completion Rate</p>
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
