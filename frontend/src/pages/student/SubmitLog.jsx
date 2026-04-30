import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function SubmitLog() {
  const { logs, loading, saveDraft, submitDraft, submitLog, submitting, error } = useLogs();
  const { draftId: routeDraftId } = useParams();
  const navigate = useNavigate();

  const [draftId, setDraftId] = useState(null);
  const [week, setWeek] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [draftError, setDraftError] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!routeDraftId) {
      return;
    }

    if (loading) {
      return;
    }

    const draft = logs.find((log) => String(log.id) === routeDraftId && log.status === "draft");

    if (!draft) {
      setDraftError("Draft not found or already submitted.");
      return;
    }

    setDraftId(draft.id);
    setWeek(String(draft.week_number));
    setDescription(draft.description || "");
    setDraftError("");
  }, [loading, logs, routeDraftId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const validateLog = () => {
    if (!week || Number(week) <= 0) {
      alert("Week number must be greater than 0");
      return false;
    }

    if (!description.trim()) {
      alert("Please describe the work completed this week.");
      return false;
    }

    return true;
  };

  const getPayload = () => ({
    ...(draftId ? { id: draftId } : {}),
    week_number: Number(week),
    description: description.trim(),
  });

  const handleSaveDraft = async () => {
    setSuccess("");

    if (!validateLog()) {
      return;
    }

    const result = await saveDraft(getPayload());

    if (!result.success) {
      return;
    }

    setDraftId(result.data.id);
    setSuccess("Draft saved.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateLog()) {
      return;
    }

    const payload = {
      week_number: Number(week),
      description: description.trim(),
    };

    const result = draftId
      ? await submitDraft(draftId, payload)
      : await submitLog(payload);

    if (!result.success) {
      return;
    }

    setSuccess("Log submitted successfully.");
    setDraftId(null);
    setWeek("");
    setDescription("");
    navigate("/weeklylogs");
  };

  return (
    <DashboardLayout title="Submit Log">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Status: {draftId ? "Draft saved" : "Draft"}
        </div>

        {draftError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{draftError}</p> : null}

        <input
          type="number"
          placeholder="Week Number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="rounded-lg border p-3"
          min="1"
          disabled={submitting || Boolean(draftError)}
        />

        <textarea
          placeholder="Describe tasks accomplished"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border p-3"
          rows={6}
          disabled={submitting || Boolean(draftError)}
        />

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting || Boolean(draftError)}
            className="flex-1 rounded-lg border border-teal-500 p-3 font-semibold text-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="submit"
            disabled={submitting || Boolean(draftError)}
            className="flex-1 rounded-lg bg-teal-500 p-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Log"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default SubmitLog;
