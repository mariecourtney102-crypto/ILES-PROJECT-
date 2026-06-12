import { useEffect, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { fetchAdminReports } from "../../api/api";

const CARD = "rounded-2xl border border-[#c7f2e8] bg-white p-5 shadow-sm";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchAdminReports();
        setReport(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Reports">
        <p className="text-gray-500">Loading reports...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Reports">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      </DashboardLayout>
    );
  }

  const overview = report?.overview || {};
  const recentLogs = report?.recent_logs || [];

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className={CARD}>
            <p className="text-sm text-gray-500">Students</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.students ?? 0}</p>
          </div>
          <div className={CARD}>
            <p className="text-sm text-gray-500">Supervisors</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.supervisors ?? 0}</p>
          </div>
          <div className={CARD}>
            <p className="text-sm text-gray-500">Placements</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.placements ?? 0}</p>
          </div>
          <div className={CARD}>
            <p className="text-sm text-gray-500">Total Logs</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.total_logs ?? 0}</p>
          </div>
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Weekly Log Status</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Draft</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.draft_logs ?? 0}</p>
            </div>
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.pending_logs ?? 0}</p>
            </div>
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.approved_logs ?? 0}</p>
            </div>
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Evaluated</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.evaluated_logs ?? 0}</p>
            </div>
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.rejected_logs ?? 0}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Average evaluated score: <span className="font-semibold text-[#0a7c6e]">{overview.average_score ?? 0}</span>
          </p>
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Recent Log Activity</h2>
          <div className="mt-4 space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-gray-500">No recent log activity found.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {log.student_name} - Week {log.week_number}
                      </p>
                      <p className="text-sm text-gray-600">{log.description}</p>
                    </div>
                    <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#0a7c6e]">
                      {log.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Score: {log.evaluation_score ?? "Pending"}</span>
                    <span>Submitted: {log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "Unknown"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
