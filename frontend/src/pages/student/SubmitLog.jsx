import { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { useLogs } from "../../context/LogContext";

function SubmitLog() {
  const { submitLog, submitting, error } = useLogs();

  const [week, setWeek] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!week || Number(week) <= 0) {
      alert("Week number must be greater than 0");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the work completed this week.");
      return;
    }

    const result = await submitLog({
      week_number: Number(week),
      description: description.trim(),
    });

    if (!result.success) {
      return;
    }

    setSuccess("Log submitted successfully.");
    setWeek("");
    setDescription("");
  };

  return (
    <DashboardLayout title="Submit Log">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
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

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-500 p-3 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit Log"}
        </button>
      </form>
    </DashboardLayout>
  );
}

export default SubmitLog;
