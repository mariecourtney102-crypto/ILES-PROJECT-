import { useEffect, useState } from "react";
import api from "../../api/api";
import DashboardLayout from "../../Components/dashboard_layout";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/feedback/")
      .then(res => setFeedbacks(res.data))
      .catch(err => setError(err.response?.data?.error || "Failed to load feedback."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Feedback">
      <div className="mx-auto max-w-5xl space-y-6">
        <section>
          <h1 className="text-2xl font-black text-slate-950">Feedback</h1>
          <p className="mt-2 text-sm text-slate-500">Feedback submitted by students through the system.</p>
        </section>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <p className="py-10 text-sm text-slate-500">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p className="py-10 text-sm text-slate-500">No feedback submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{fb.subject}</p>
                      <p className="mt-1 text-sm text-slate-500">{fb.message}</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                      {fb.rating}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
