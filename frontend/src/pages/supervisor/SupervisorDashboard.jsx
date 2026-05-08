import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useAuth } from "../../context/AuthContext";
import { useLogs } from "../../context/LogContext";
import { fetchSupervisorStudents } from "../../api/api";

function SupervisorDashboard() {
  const { user } = useAuth();
  const { logs, loading, error } = useLogs();
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchSupervisorStudents()
      .then((data) => {
        if (mounted) setStudents(data);
      })
      .catch(() => {
        if (mounted) setStudents([]);
      })
      .finally(() => {
        if (mounted) setStudentsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const pendingLogs = logs.filter((log) => log.status === "pending").length;
  const logsNeedingReview = logs.filter((log) => log.status === "pending");
  const approvedToday = logs.filter((log) => {
    if (log.status !== "approved" || !log.reviewed_at) return false;
    return new Date(log.reviewed_at).toDateString() === new Date().toDateString();
  }).length;
  const recentActivity = useMemo(
    () =>
      [...logs]
        .filter((log) => log.status !== "pending")
        .sort((a, b) => new Date(b.reviewed_at || b.date_submitted) - new Date(a.reviewed_at || a.date_submitted))
        .slice(0, 4),
    [logs]
  );

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="mx-auto max-w-7xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">Supervisor Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Review and approve intern weekly logs.</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Total Interns</p>
            <p className="mt-3 text-4xl font-black text-teal-600">{students.length}</p>
            <p className="mt-3 text-sm text-slate-400">Assigned to you</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Approved Today</p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{approvedToday}</p>
            <p className="mt-3 text-sm text-slate-400">Reviewed today</p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Pending Reviews</p>
            <p className="mt-3 text-4xl font-black text-orange-600">{pendingLogs}</p>
            <p className="mt-3 text-sm text-slate-400">Awaiting action</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-black text-slate-900">Assigned Students</h2>
              <span className="text-xs text-slate-400">{students.length} total</span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="pb-3 font-medium">Student</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsLoading ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-slate-400">Loading assigned students...</td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-slate-400">No assigned students yet.</td>
                    </tr>
                  ) : (
                    students.slice(0, 5).map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="py-4 text-slate-700">{student.name || student.username}</td>
                        <td className="py-4 text-slate-700">
                          {student.placement?.place_of_internship || "Not set"}
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase text-teal-700">
                            {student.placement ? "Active" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-black text-slate-900">Pending Logbook Approvals</h2>
              <span className="text-xs text-slate-400">{pendingLogs} pending</span>
            </div>

            <div className="mt-6">
              {loading ? (
                <p className="py-14 text-center text-sm text-slate-400">Loading pending reviews...</p>
              ) : logsNeedingReview.length === 0 ? (
                <p className="py-14 text-center text-sm text-slate-400">No pending reviews.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {logsNeedingReview.slice(0, 4).map((log) => (
                    <div key={log.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{log.student_name || "Student"}</p>
                          <p className="mt-1 text-sm text-slate-500">Week {log.week_number}</p>
                        </div>
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-orange-700">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No recent activity yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {recentActivity.map((log) => (
                <div key={log.id} className="py-3 text-sm text-slate-600">
                  {user?.name || "Supervisor"} marked Week {log.week_number} for {log.student_name || "a student"} as{" "}
                  <span className="font-semibold text-slate-900">{log.status}</span>.
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default SupervisorDashboard;
