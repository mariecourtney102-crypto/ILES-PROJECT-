import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../api/api";
import { Briefcase, BookOpen, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";

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
      <div className="max-w-6xl space-y-6">
        
        {/* Current Placement Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-3">
            <Briefcase size={24} className="text-white" />
            <h2 className="text-xl font-semibold text-white">Current Internship Placement</h2>
          </div>

          <div className="p-6">
            {loadingPlacement ? (
              <p className="text-gray-500">Loading placement details...</p>
            ) : errorPlacement ? (
              <p className="text-red-600">
                {errorPlacement}
                <Link to="/student/internship-details" className="ml-2 text-blue-600 hover:underline">
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
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <p className="text-lg font-semibold text-green-700 capitalize">{placement.status || "Active"}</p>
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
          <h3 className="text-xs uppercase font-semibold text-gray-600 mb-4">Logbook Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Draft Logs */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Draft Logs</span>
              </div>
              <p className="text-3xl font-bold text-gray-400">{draft}</p>
            </div>

            {/* Pending Logs */}
            <div className="bg-white rounded-lg border border-yellow-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-700">Pending Review</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{pending}</p>
            </div>

            {/* Approved Logs */}
            <div className="bg-white rounded-lg border border-green-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-sm font-semibold text-green-700">Approved</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{approved}</p>
            </div>

            {/* Rejected Logs */}
            <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <XCircle size={20} className="text-red-600" />
                <span className="text-sm font-semibold text-red-700">Rejected</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{rejected}</p>
            </div>
          </div>
        </div>

        {/* Current Week Info Card */}
        {currentWeek > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Current Week:</span> Week {currentWeek}
            </p>
          </div>
        )}

        {/* Recent Logbook Entries */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Recent Logbook Entries</h2>
            </div>
            <Link
              to="/weeklylogs"
              className="text-sm text-blue-100 hover:text-white underline transition"
            >
              View All
            </Link>
          </div>

          <div className="p-6">
            {logsError && <p className="mb-4 text-sm text-red-600">{logsError}</p>}
            {logsLoading ? (
              <p className="text-gray-500">Loading logs...</p>
            ) : recentLogs.length === 0 ? (
              <p className="text-gray-500">No logs submitted yet. Start by creating your first entry.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Week {log.week_number}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                          log.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : log.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : log.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
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
