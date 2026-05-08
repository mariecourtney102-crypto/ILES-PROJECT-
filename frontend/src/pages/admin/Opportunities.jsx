import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../Components/dashboard_layout";

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/opportunities/")
      .then(res => setOpportunities(res.data))
      .catch(err => setError(err.response?.data?.error || "Failed to load opportunities."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Opportunities">
      <div className="mx-auto max-w-5xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">Opportunities</h1>
          <p className="mt-2 text-sm text-slate-500">Placement opportunities summarized from saved student placements.</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <p className="py-10 text-sm text-slate-500">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <p className="py-10 text-sm text-slate-500">No opportunities found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {opportunities.map((opp) => (
                <div key={opp.id} className="py-4">
                  <p className="font-semibold text-slate-900">{opp.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{opp.summary}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Opportunities;
