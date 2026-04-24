import React from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useAuth } from "../../context/AuthContext";
import { useLogs } from "../../context/LogContext";
import { AlertCircle, CheckCircle, Clock, Users, FileText } from "lucide-react";

function SupervisorDashboard() {
  const { user } = useAuth();
  const { logs } = useLogs();


  // Calculate stats
  const pendingLogs = logs.filter(l => l.status === "pending").length;
  const reviewedLogs = logs.filter(l => l.status === "reviwed").length;
  const draftLogs = logs.filter(l => l.status === "draft").length;
  const logsNeedingReview = logs.filter(l => l.status !== "reviwed");

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="max-w-6xl">
        {/* SUPERVISOR PROFILE SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-teal-600">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-teal-600" />
            Profile Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user?.identifier || user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold text-gray-800 capitalize">{user?.role || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{user?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* ALERTS & NOTIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900">Pending Review</h3>
                <p className="text-2xl font-bold text-yellow-700">{pendingLogs}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-green-900">Reviewed Logs</h3>
                <p className="text-2xl font-bold text-green-700">{reviewedLogs}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <div className="flex items-start gap-3">
              <Users className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900">Draft Logs</h3>
                <p className="text-2xl font-bold text-blue-700">{draftLogs}</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* WEEKLY LOGS REVIEW PANEL */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={24} className="text-teal-600" />
            Weekly Logs Review Panel
          </h2>
          {logsNeedingReview.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logsNeedingReview.map((log, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">Week {log.week}</p>
                      <p className="text-sm text-gray-600">{log.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm">
                    Review & Comment
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">All logs have been reviewed! ✓</p>
          )}
        </div>

        {/* QUICK STATS */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Dashboard Summary</h3>
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
              <p className="text-3xl font-bold">{logs.length > 0 ? Math.round((reviewedLogs / logs.length) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SupervisorDashboard;
