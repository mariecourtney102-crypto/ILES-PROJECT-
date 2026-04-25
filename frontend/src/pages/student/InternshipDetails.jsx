import { useEffect, useMemo, useState } from "react";
import { Briefcase, Building2, CalendarDays, Trash2, UserCheck, Users } from "lucide-react";
import DashboardLayout from "../../Components/dashboard_layout";
import {
  createPlacement,
  deletePlacement,
  fetchPlacement,
  updatePlacement,
} from "../../api/api";

const emptyForm = {
  place_of_internship: "",
  department: "",
  supervisor_name: "",
  start_date: "",
  end_date: "",
};

const fieldMeta = [
  {
    key: "place_of_internship",
    label: "Place of Internship",
    icon: Building2,
    description: "The host organization for your placement.",
    type: "text",
  },
  {
    key: "department",
    label: "Department",
    icon: Users,
    description: "The specific team or department you were assigned to.",
    type: "text",
  },
  {
    key: "supervisor_name",
    label: "Supervisor",
    icon: UserCheck,
    description: "The officer overseeing your daily tasks.",
    type: "text",
  },
  {
    key: "start_date",
    label: "Start Date",
    icon: CalendarDays,
    description: "The official starting date of your internship.",
    type: "date",
  },
  {
    key: "end_date",
    label: "End Date",
    icon: CalendarDays,
    description: "The planned ending date of your internship.",
    type: "date",
  },
];

function InternshipDetails() {
  const [formData, setFormData] = useState(emptyForm);
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPlacement = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPlacement();
      setPlacement(data);
      setFormData({
        place_of_internship: data.place_of_internship || "",
        department: data.department || "",
        supervisor_name: data.supervisor_name || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setPlacement(null);
        setFormData(emptyForm);
      } else {
        setError(err.response?.data?.error || "Failed to load internship placement.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacement();
  }, []);

  const durationText = useMemo(() => {
    if (!formData.start_date || !formData.end_date) {
      return "Set both dates to see your placement period.";
    }

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffInMs = end - start;

    if (Number.isNaN(diffInMs) || diffInMs < 0) {
      return "Check your dates. The end date should be after the start date.";
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}`;
  }, [formData.end_date, formData.start_date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = placement ? await updatePlacement(formData) : await createPlacement(formData);
      const savedPlacement = response.placement;
      setPlacement(savedPlacement);
      setFormData({
        place_of_internship: savedPlacement.place_of_internship || "",
        department: savedPlacement.department || "",
        supervisor_name: savedPlacement.supervisor_name || "",
        start_date: savedPlacement.start_date || "",
        end_date: savedPlacement.end_date || "",
      });
      setSuccess(response.message || "Placement saved successfully.");
    } catch (err) {
      const errorData = err.response?.data;
      const firstFieldError = errorData && typeof errorData === "object"
        ? Object.values(errorData).flat().find(Boolean)
        : null;
      setError(firstFieldError || errorData?.error || "Failed to save internship placement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await deletePlacement();
      setPlacement(null);
      setFormData(emptyForm);
      setSuccess(response.message || "Placement deleted.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete internship placement.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Internship Details">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">Placement Overview</h2>
          <p className="mt-2 text-sm text-gray-500">
            Save your internship host, department, supervisor, and dates so your record stays available throughout the semester.
          </p>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div> : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{placement ? "Update Placement" : "Add Placement"}</h3>
                <p className="text-sm text-gray-500">Your placement details are stored in the backend and can be updated anytime.</p>
              </div>
              {placement ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              ) : null}
            </div>

            {loading ? (
              <p className="py-12 text-sm text-gray-500">Loading placement details...</p>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                {fieldMeta.map(({ key, label, type, description }) => (
                  <label key={key} className={key === "place_of_internship" ? "md:col-span-2" : ""}>
                    <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
                    <input
                      type={type}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                      disabled={saving || deleting}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-teal-500"
                    />
                    <span className="mt-1 block text-xs text-gray-400">{description}</span>
                  </label>
                ))}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={saving || deleting}
                    className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Saving..." : placement ? "Update Placement" : "Save Placement"}
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">Current Details</h3>
              <div className="mt-5 space-y-4">
                {fieldMeta.map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400">{description}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {formData[key] || <span className="italic text-gray-400">Not specified</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-teal-100">Placement Status</p>
                  <h3 className="mt-2 text-2xl font-semibold">{placement ? "Recorded" : "Pending Setup"}</h3>
                  <p className="mt-2 text-sm text-teal-50">
                    {placement
                      ? "Your internship placement is saved. Keep your weekly logs updated for supervisor review."
                      : "Add your placement details so your internship record is complete before weekly reporting begins."}
                  </p>
                </div>
                <Briefcase size={44} className="opacity-70" />
              </div>

              <div className="mt-6 rounded-xl bg-white/10 p-4">
                <p className="text-sm text-teal-100">Duration</p>
                <p className="mt-1 text-lg font-semibold">{durationText}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InternshipDetails;
