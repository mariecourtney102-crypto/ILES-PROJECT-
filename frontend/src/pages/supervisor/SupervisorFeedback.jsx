import React, { useState } from "react";
import DashboardLayout from "../../Components/dashboard_layout";
import { MessageSquare } from "lucide-react";
import { useLogs } from "../../context/LogContext";

export default function SupervisorFeedback() {
  const { logs, loading, error, reviewLog, reviewingId } = useLogs();
  const [formState, setFormState] = useState({});
  const [localError, setLocalError] = useState("");

  const pendingLogs = logs.filter((log) => log.status === "pending");

  const handleChange = (logId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [logId]: {
        ...prev[logId],
        [field]: value,
      },
    }));
  };

  const handleReview = async (logId, status) => {
    const currentForm = formState[logId] || {};

    if (status === "rejected" && !currentForm.supervisor_comment?.trim()) {
      setLocalError("Please provide a reason before rejecting this log.");
      return;
    }

    setLocalError("");
    await reviewLog(logId, {
      status,
      supervisor_comment: currentForm.supervisor_comment || "",
      evaluation_score: currentForm.evaluation_score ? Number(currentForm.evaluation_score) : undefined,
    });
  };

  return (
    <DashboardLayout title="Feedback">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <MessageSquare size={24} className="text-teal-600" />
          Review Assigned Student Logs
        </h2>

        {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {localError ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{localError}</p> : null}

        {loading ? (
          <p className="py-6 text-center text-gray-500">Loading logs...</p>
        ) : pendingLogs.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No pending logs to review.</p>
        ) : (
          <div className="space-y-4">
            {pendingLogs.map((log) => {
              const currentForm = formState[log.id] || {};

              return (
                <div key={log.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{log.student_name}</p>
                      <p className="text-sm text-gray-500">Week {log.week_number}</p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {log.status}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700">{log.description}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]">
                    <textarea
                      value={currentForm.supervisor_comment || ""}
                      onChange={(e) => handleChange(log.id, "supervisor_comment", e.target.value)}
                      placeholder="Add feedback, or provide a rejection reason"
                      className="min-h-28 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                      disabled={reviewingId === log.id}
                    />

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currentForm.evaluation_score || ""}
                      onChange={(e) => handleChange(log.id, "evaluation_score", e.target.value)}
                      placeholder="Score (optional)"
                      className="h-fit rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500"
                      disabled={reviewingId === log.id}
                    />
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleReview(log.id, "approved")}
                      disabled={reviewingId === log.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {reviewingId === log.id ? "Saving..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReview(log.id, "rejected")}
                      disabled={reviewingId === log.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {reviewingId === log.id ? "Saving..." : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
