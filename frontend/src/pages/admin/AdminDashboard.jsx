import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import api from "../../api/api";

const metricCards = [
  {
    key: "total_students",
    label: "Total Students",
    helper: "Registered students",
    color: "text-teal-600",
  },
  {
    key: "active_internships",
    label: "Active Internships",
    helper: "Placements in progress",
    color: "text-emerald-600",
  },
  {
    key: "completed_internships",
    label: "Completed Internships",
    helper: "Placements finished",
    color: "text-orange-600",
  },
  {
    key: "pending_logs",
    label: "Pending Reviews",
    helper: "Weekly logs awaiting review",
    color: "text-orange-600",
  },
  {
    key: "total_supervisors",
    label: "Total Supervisors",
    helper: "Registered supervisors",
    color: "text-teal-600",
  },
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/")
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load admin dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const maxWeeklyLogs = useMemo(() => {
    if (!dashboard?.logs_per_week?.length) return 0;
    return Math.max(...dashboard.logs_per_week.map((item) => item.total));
  }, [dashboard]);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">System-wide overview</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((card) => (
            <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{card.label}</p>
              <p className={`mt-3 text-4xl font-black ${card.color}`}>
                {loading ? "..." : dashboard?.[card.key] ?? 0}
              </p>
              <p className="mt-3 text-sm text-slate-400">{card.helper}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-black text-slate-900">Logs Submitted Per Week</h2>
            <p className="mt-1 text-sm text-slate-500">Total submitted weekly logs grouped by internship week</p>
          </div>

          <div className="mt-8">
            {loading ? (
              <p className="py-12 text-sm text-slate-500">Loading weekly log data...</p>
            ) : !dashboard?.logs_per_week?.length ? (
              <p className="py-12 text-sm text-slate-500">No submitted logs yet.</p>
            ) : (
              <div className="space-y-4">
                {dashboard.logs_per_week.map((item) => {
                  const width = maxWeeklyLogs ? Math.max(8, Math.round((item.total / maxWeeklyLogs) * 100)) : 0;

                  return (
                    <div key={item.week_number} className="grid gap-3 sm:grid-cols-[90px_1fr_48px] sm:items-center">
                      <p className="text-sm font-semibold text-slate-600">Week {item.week_number}</p>
                      <div className="h-4 overflow-hidden rounded-full bg-teal-50">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-700">{item.total}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
