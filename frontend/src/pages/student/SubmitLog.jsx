import { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function SubmitLog() {
  const { saveDraft, submitDraft, submitLog, submitting, error } = useLogs();

  const [draftId, setDraftId] = useState(null);
  const [week, setWeek] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

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
  };

  return (
    <DashboardLayout title="Submit Log">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Status: {draftId ? "Draft saved" : "Draft"}
        </div>

        <input
          type="number"
          placeholder="Week Number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="rounded-lg border p-3"
          min="1"
          disabled={submitting}
        />

        <textarea
          placeholder="Describe tasks accomplished"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border p-3"
          rows={6}
          disabled={submitting}
        />

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            className="flex-1 rounded-lg border border-teal-500 p-3 font-semibold text-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="submit"
            disabled={submitting}
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
