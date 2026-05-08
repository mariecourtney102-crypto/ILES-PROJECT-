import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../Components/dashboard_layout";

function Reports() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/reports/")
      .then(res => setStats(res.data))
      .catch(err => setError(err.response?.data?.error || "Failed to load reports."));
  }, []);

  return (
    <DashboardLayout title="Reports">
      <div className="mx-auto max-w-5xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">Reports</h1>
          <p className="mt-2 text-sm text-slate-500">High-level counts from the current internship records.</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {!stats ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="py-10 text-sm text-slate-500">Loading reports...</p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Students</p>
              <p className="mt-3 text-4xl font-black text-teal-600">{stats.students}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Supervisors</p>
              <p className="mt-3 text-4xl font-black text-emerald-600">{stats.supervisors}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Opportunities</p>
              <p className="mt-3 text-4xl font-black text-orange-600">{stats.opportunities}</p>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Reports;
