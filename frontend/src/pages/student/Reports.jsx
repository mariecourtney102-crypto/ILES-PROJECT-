import { useEffect, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { fetchStudentReports } from "../../api/api";

const CARD = "rounded-2xl border border-[#c7f2e8] bg-white p-5 shadow-sm";

function StudentReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchStudentReports();
        setReport(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load your report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Reports">
        <p className="text-gray-500">Loading your report...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Reports">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      </DashboardLayout>
    );
  }

  const overview = report?.overview || {};
  const student = report?.student || {};
  const placement = report?.placement;
  const recentLogs = report?.recent_logs || [];
  const evaluations = report?.evaluations || [];

  return (
    <DashboardLayout title="My Reports">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className={CARD}>
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.average_score ?? 0}</p>
          </div>
          <div className={CARD}>
            <p className="text-sm text-gray-500">Evaluated Logs</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.evaluated_logs ?? 0}</p>
          </div>
          <div className={CARD}>
            <p className="text-sm text-gray-500">Pending Logs</p>
            <p className="mt-2 text-3xl font-bold text-[#0a7c6e]">{overview.pending_logs ?? 0}</p>
          </div>
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Placement Summary</h2>
          {placement ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Student</p>
                <p className="mt-1 font-semibold text-gray-900">{student.name || student.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Company</p>
                <p className="mt-1 font-semibold text-gray-900">{placement.place_of_internship || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Department</p>
                <p className="mt-1 font-semibold text-gray-900">{placement.department || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Supervisor</p>
                <p className="mt-1 font-semibold text-gray-900">{placement.supervisor_name || "N/A"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No internship placement has been recorded yet.</p>
          )}
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Log Status Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="rounded-xl bg-[#f1fbf8] p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.total_logs ?? 0}</p>
            </div>
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
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="mt-2 text-2xl font-bold text-[#0a7c6e]">{overview.rejected_logs ?? 0}</p>
            </div>
          </div>
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Recent Logs</h2>
          <div className="mt-4 space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-gray-500">No log entries available yet.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">Week {log.week_number}</p>
                      <p className="text-sm text-gray-600">{log.description}</p>
                    </div>
                    <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#0a7c6e]">
                      {log.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Score: {log.evaluation_score ?? "Pending"}</span>
                    <span>Reviewed: {log.reviewed_at ? new Date(log.reviewed_at).toLocaleString() : "Not yet"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={CARD}>
          <h2 className="text-xl font-semibold text-gray-800">Evaluation Breakdown</h2>
          <div className="mt-4 space-y-3">
            {evaluations.length === 0 ? (
              <p className="text-gray-500">No evaluated criteria have been recorded yet.</p>
            ) : (
              evaluations.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Week {item.week_number} - {item.criteria_name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{item.criteria}</p>
                    </div>
                    <p className="text-lg font-bold text-[#0a7c6e]">{item.score}</p>
                  </div>
                  {item.comment ? <p className="mt-2 text-sm text-gray-600">{item.comment}</p> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentReports;
