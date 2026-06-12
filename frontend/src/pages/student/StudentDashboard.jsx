import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../api/api";
import { Briefcase, BookOpen, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";

const THEME = {
  panel: "bg-white rounded-xl shadow-md border border-[#c7f2e8] ",
};

function StudentDashboard() {
  const { logs, loading: logsLoading, error: logsError } = useLogs();
  const [placement, setPlacement] = useState(null);
  const [loadingPlacement, setLoadingPlacement] = useState(true);
  const [errorPlacement, setErrorPlacement] = useState(null);

  // Fetch placement data on mount
  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        const response = await axiosInstance.get("/placement/");
        setPlacement(response.data);
        setErrorPlacement(null);
      } catch (err) {
        setErrorPlacement(err.response?.data?.error || "Failed to load placement");
      } finally {
        setLoadingPlacement(false);
      }
    };

    fetchPlacement();
  }, []);

  // Calculate log statistics
  const draft = logs.filter((log) => log.status === "draft").length;
  const pending = logs.filter((log) => log.status === "pending").length;
  const approved = logs.filter((log) => log.status === "approved").length;
  const rejected = logs.filter((log) => log.status === "rejected").length;

  // Get current week from latest log
  const currentWeek = logs.length > 0 ? Math.max(...logs.map((log) => log.week_number || 0)) : 0;

  // Get 5 most recent logs
  const recentLogs = logs.slice(-5).reverse();

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-9">
        
        {/* Current Placement Card */}
        <div className={`${THEME.panel} shadow-[0_10px_30px_rgba(13,148,136,0.08)]`}>
          <div className="bg-gradient-to-r from-[#0a7c6e] via-[#0d9e8c] to-[#3db88a] px-6 py-4 flex items-center gap-3">
            <Briefcase size={24} className="text-white" />
            <h2 className="text-xl font-semibold text-white">Current Internship Placement</h2>
          </div>

          <div className="p-6">
            {loadingPlacement ? (
              <p className="text-gray-500">Loading placement details...</p>
            ) : errorPlacement ? (
              <p className="text-rose-600">
                {errorPlacement}
                <Link to="/student/internship-details" className="ml-2 text-[#0a7c6e] hover:text-[#0d9e8c] hover:underline">
                  Add placement details
                </Link>
              </p>
            ) : placement ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Company</p>
                  <p className="text-lg font-semibold text-gray-900">{placement.place_of_internship || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{placement.department || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Supervisor</p>
                  <p className="text-lg font-semibold text-gray-900">{placement.supervisor_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#3db88a]"></span>
                    <p className="text-lg font-semibold text-[#0a7c6e] capitalize">{placement.status || "Active"}</p>
                  </div>
                </div>
                {placement.start_date && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Start Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(placement.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {placement.end_date && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold mb-1">End Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(placement.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No placement details found. Please add your placement information.</p>
            )}
          </div>
        </div>
        
        {/* Log Status Overview */}
        <div>
          <h3 className="text-xs uppercase font-semibold text-[#0a7c6e] mb-4 tracking-wide">Logbook Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Draft Logs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-[#0a7c6e]" />
                <span className="text-sm font-semibold text-[#0a7c6e]">Draft Logs</span>
              </div>
              <p className="text-3xl font-bold text-[#0a7c6e]">{draft}</p>
            </div>

            {/* Pending Logs */}
            <div className="rounded-2xl border border-[#c7f2e8] bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={20} className="text-[#0d9e8c]" />
                <span className="text-sm font-semibold text-[#0a7c6e]">Pending Review</span>
              </div>
              <p className="text-3xl font-bold text-[#0d9e8c]">{pending}</p>
            </div>

            {/* Approved Logs */}
            <div className="rounded-2xl border border-[#c7f2e8] bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-[#3db88a]" />
                <span className="text-sm font-semibold text-[#0a7c6e]">Approved</span>
              </div>
              <p className="text-3xl font-bold text-[#3db88a]">{approved}</p>
            </div>

            {/* Rejected Logs */}
            <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <XCircle size={20} className="text-rose-600" />
                <span className="text-sm font-semibold text-rose-700">Rejected</span>
              </div>
              <p className="text-3xl font-bold text-rose-600">{rejected}</p>
            </div>
          </div>
        </div>

        {/* Current Week Info Card */}
      {currentWeek > 0 && (
          <div className="rounded-lg border border-[#c7f2e8] bg-gradient-to-r from-[#f1fbf8] to-[#ecfdf5] p-4">
            <p className="text-sm text-[#0a7c6e]">
              <span className="font-semibold">Current Week:</span> Week {currentWeek}
            </p>
          </div>
        )}

        {/* Recent Logbook Entries */}
        <div className={`${THEME.panel} shadow-[0_10px_30px_rgba(10,124,110,0.08)]`}>
          <div className="bg-gradient-to-r from-[#0a7c6e] via-[#0d9e8c] to-[#3db88a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Recent Logbook Entries</h2>
            </div>
            <Link
              to="/weeklylogs"
              className="text-sm text-white/90 underline transition hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="p-6">
            {logsError && <p className="mb-4 text-sm text-rose-600">{logsError}</p>}
            {logsLoading ? (
              <p className="text-gray-500">Loading logs...</p>
            ) : recentLogs.length === 0 ? (
              <p className="text-gray-500">No logs submitted yet. Start by creating your first entry.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-[#c7f2e8] p-4 transition hover:bg-[#f1fbf8]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Week {log.week_number}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                      </div>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                          log.status === "approved"
                            ? "bg-[#ecfdf5] text-[#0a7c6e]"
                            : log.status === "pending"
                            ? "bg-[#d1fae5] text-[#0a7c6e]"
                            : log.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.status || "draft"}
                      </span>
                    </div>
                    {log.date_submitted && (
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(log.date_submitted).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
