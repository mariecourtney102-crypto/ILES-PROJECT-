import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";
import { useAuth } from "../../context/AuthContext";
import { fetchPlacement } from "../../api/api";
import { BookOpen, BriefcaseBusiness, CalendarDays, UserRound } from "lucide-react";

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StudentDashboard() {
  const { user } = useAuth();
  const { logs, loading, error } = useLogs();
  const [placement, setPlacement] = useState(null);
  const [placementLoading, setPlacementLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchPlacement()
      .then((data) => {
        if (mounted) setPlacement(data);
      })
      .catch(() => {
        if (mounted) setPlacement(null);
      })
      .finally(() => {
        if (mounted) setPlacementLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const draftLogs = logs.filter((log) => log.status === "draft");
  const submittedLogs = logs.filter((log) => log.status !== "draft");
  const approvedLogs = logs.filter((log) => log.status === "approved");
  const latestWeek = logs.reduce((highest, log) => Math.max(highest, Number(log.week_number) || 0), 0);
  const progressPercent = latestWeek > 0 ? Math.min(100, Math.round((submittedLogs.length / latestWeek) * 100)) : 0;
  const recentLogs = useMemo(
    () =>
      [...logs]
        .sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted))
        .slice(0, 4),
    [logs]
  );

  return (
    <DashboardLayout title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">
            {getGreeting()}, {user?.name || "Student"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Here&apos;s what&apos;s happening with your internship today.</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current Placement</p>
                <h2 className="mt-3 text-xl font-black text-slate-950">
                  {placementLoading
                    ? "Loading..."
                    : placement?.place_of_internship || "No placement yet"}
                </h2>
                <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                  {placement ? "Active" : "Pending"}
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <BriefcaseBusiness size={24} />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Dates</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <CalendarDays size={17} />
                  <span>
                    {placement
                      ? `${formatDate(placement.start_date)} to ${formatDate(placement.end_date)}`
                      : "Add placement dates"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Supervisor</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <UserRound size={16} />
                    {placement?.supervisor_name || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900">Logbook Progress</h2>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-black text-teal-600">{submittedLogs.length}</span>
              <span className="pb-2 text-sm text-slate-400">submitted</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">Current week: {latestWeek || 1}</p>
            <p className="mt-1 text-sm text-slate-500">{draftLogs.length} draft, {approvedLogs.length} approved</p>
            <div className="mt-5 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-black text-slate-900">Recent Logbook Entries</h2>
              <Link to="/weeklylogs" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
                View all &rarr;
              </Link>
            </div>

            <div className="mt-5">
              {loading ? (
                <p className="py-12 text-center text-sm text-slate-500">Loading logbook entries...</p>
              ) : recentLogs.length === 0 ? (
                <div className="py-14 text-center">
                  <BookOpen className="mx-auto text-slate-300" size={34} />
                  <p className="mt-4 text-sm text-slate-400">No logbook entries yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">Week {log.week_number}</p>
                        <p className="mt-1 max-w-2xl text-sm text-slate-500">{log.description}</p>
                      </div>
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase text-teal-700">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
export default StudentDashboard;
