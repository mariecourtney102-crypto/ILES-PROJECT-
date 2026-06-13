import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../Components/dashboard_layout";
import { MessageSquare } from "lucide-react";
import { useLogs } from "../../context/LogContext";
import { fetchSupervisorEvaluations, saveSupervisorEvaluations } from "../../api/api";
import SupervisorEvaluationForm, { createFallbackEvaluationRows } from "./SupervisorEvaluationForm";

const createEmptyEvaluationState = () => ({
  logId: null,
  loading: false,
  saving: false,
  error: "",
  criteria: [],
  rows: createFallbackEvaluationRows(),
  weighted_score: null,
});

function createEmptyReviewState() {
  return {};
}

export default function SupervisorFeedback() {
  const [searchParams] = useSearchParams();
  const { logs, loading, error, reviewLog, reviewingId, loadLogs } = useLogs();
  const [reviewState, setReviewState] = useState(createEmptyReviewState());
  const [activeEvaluationId, setActiveEvaluationId] = useState(null);
  const [evaluationState, setEvaluationState] = useState(createEmptyEvaluationState);
  const [localError, setLocalError] = useState("");

  const reviewableLogs = logs.filter((log) => log.status !== "draft");

  const activeLog = useMemo(
    () => reviewableLogs.find((log) => log.id === activeEvaluationId) || null,
    [reviewableLogs, activeEvaluationId]
  );

  useEffect(() => {
    const weeklyLogId = Number(searchParams.get("weekly_log_id"));
    if (!weeklyLogId || loading) {
      return;
    }

    const log = reviewableLogs.find((item) => item.id === weeklyLogId);
    if (log && (log.status === "approved" || log.status === "evaluated")) {
      setActiveEvaluationId(weeklyLogId);
      setLocalError("");
    }
  }, [searchParams, reviewableLogs, loading]);

  useEffect(() => {
    if (!activeLog) {
      setEvaluationState(createEmptyEvaluationState());
      return;
    }

    if (activeLog.status !== "approved" && activeLog.status !== "evaluated") {
      setActiveEvaluationId(null);
      setEvaluationState(createEmptyEvaluationState());
      return;
    }

    let cancelled = false;

    const loadEvaluation = async () => {
      setEvaluationState((prev) => ({
        ...prev,
        logId: activeLog.id,
        loading: true,
        saving: false,
        error: "",
      }));

      try {
        const data = await fetchSupervisorEvaluations(activeLog.id);
        if (cancelled) {
          return;
        }

        const existingByCriteria = new Map((data.evaluations || []).map((item) => [item.criteria, item]));
        const rows = (data.criteria || []).map((criteria) => {
          const existing = existingByCriteria.get(criteria.id);
          return {
            criteria_id: criteria.id,
            criteria_name: criteria.criteria_name,
            criteria: criteria.criteria,
            score: existing?.score ?? "",
            comment: existing?.comment ?? "",
          };
        });

        setEvaluationState({
          logId: activeLog.id,
          loading: false,
          saving: false,
          error: "",
          criteria: data.criteria || [],
          rows,
          weighted_score: data.weighted_score ?? null,
        });
      } catch (err) {
        if (cancelled) {
          return;
        }

        setEvaluationState((prev) => ({
          ...prev,
          loading: false,
          error:
            err.response?.data?.error ||
            "Failed to load evaluation criteria. You can still enter scores and try saving again.",
        }));
      }
    };

    loadEvaluation();

    return () => {
      cancelled = true;
    };
  }, [activeLog?.id, activeLog?.status]);

  const handleChange = (logId, field, value) => {
    setReviewState((prev) => ({
      ...prev,
      [logId]: {
        ...prev[logId],
        [field]: value,
      },
    }));
  };

  const handleReview = async (logId, status) => {
    const currentForm = reviewState[logId] || {};

    if (status === "rejected" && !currentForm.supervisor_comment?.trim()) {
      setLocalError("Please provide a reason before rejecting this log.");
      return;
    }

    setLocalError("");
    const result = await reviewLog(logId, {
      status,
      supervisor_comment: currentForm.supervisor_comment || "",
    });

    if (result.success) {
      setReviewState((prev) => ({
        ...prev,
        [logId]: {},
      }));
    }

    if (result.success && status === "approved") {
      setActiveEvaluationId(logId);
    }
  };

  const openEvaluationForm = (log) => {
    if (log.status !== "approved" && log.status !== "evaluated") {
      setLocalError("Approval is required before evaluation can be opened.");
      return;
    }

    setLocalError("");
    setActiveEvaluationId(log.id);
  };

  const handleEvaluationChange = (criteriaId, field, value) => {
    setEvaluationState((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.criteria_id === criteriaId ? { ...row, [field]: value } : row
      ),
    }));
  };

  const weightedScore = useMemo(() => {
    if (!evaluationState.rows.length) {
      return null;
    }

    const scores = evaluationState.rows.map((row) => {
      const value = row.score === "" ? null : Number(row.score);
      if (value === null || Number.isNaN(value)) {
        return null;
      }
      return value;
    });

    if (scores.some((score) => score === null)) {
      return null;
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  }, [evaluationState.rows]);

  const saveEvaluation = async () => {
    if (!activeLog) {
      return { success: false, error: "Select an approved log first." };
    }

    const invalidRow = evaluationState.rows.find((row) => {
      if (row.score === "" || row.score === null) {
        return true;
      }

      const scoreValue = Number(row.score);
      return !Number.isInteger(scoreValue) || scoreValue < 0 || scoreValue > 100;
    });

    if (invalidRow) {
      setEvaluationState((prev) => ({
        ...prev,
        error: "Enter whole number scores between 0 and 100 for all four criteria.",
      }));
      return { success: false, error: "Invalid evaluation scores." };
    }

    setEvaluationState((prev) => ({ ...prev, saving: true, error: "" }));

    try {
      const payload = {
        weekly_log_id: activeLog.id,
        evaluations: evaluationState.rows.map((row) => ({
          criteria_id: row.criteria_id,
          score: parseInt(row.score, 10),
          comment: row.comment || "",
        })),
      };

      const data = await saveSupervisorEvaluations(payload);

      setEvaluationState((prev) => ({
        ...prev,
        loading: false,
        saving: false,
        error: "",
        weighted_score: data.weighted_score ?? weightedScore,
      }));

      setActiveEvaluationId(null);
      await loadLogs();

      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to save evaluations.";
      setEvaluationState((prev) => ({ ...prev, saving: false, error: message }));
      return { success: false, error: message };
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Feedback">
        <p className="text-gray-500">Loading logs...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Feedback">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <MessageSquare size={24} className="text-[#0a7c6e]" />
          Review Assigned Student Logs
        </h2>

        {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {localError ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{localError}</p> : null}

        {reviewableLogs.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No logs available to review.</p>
        ) : (
          <div className="space-y-4">
            {reviewableLogs.map((log) => {
              const currentForm = reviewState[log.id] || {};
              const canEvaluate = log.status === "approved";
              const isEvaluated = log.status === "evaluated";

              return (
                <div key={log.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{log.student_name}</p>
                      <p className="text-sm text-gray-500">Week {log.week_number}</p>
                    </div>
                    <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#0a7c6e]">
                      {log.status}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700">{log.description}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr]">
                    {log.status === "pending" ? (
                      <textarea
                        value={currentForm.supervisor_comment || ""}
                        onChange={(e) => handleChange(log.id, "supervisor_comment", e.target.value)}
                        placeholder="Add feedback, or provide a rejection reason"
                        className="min-h-28 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#0d9e8c]"
                        disabled={reviewingId === log.id}
                      />
                    ) : (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                        {log.status === "approved"
                          ? "This log has been approved."
                          : log.status === "evaluated"
                          ? "This log has been evaluated."
                          : "This log has been rejected."}
                      </div>
                    )}

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700">Review Status</p>
                      <p className="mt-2 text-sm text-gray-600">
                        {isEvaluated
                          ? "This log has been evaluated."
                          : canEvaluate
                          ? "This log is approved and ready for evaluation."
                          : log.status === "pending"
                          ? "This log is waiting for approval."
                          : "This log has been rejected."}
                      </p>
                      {log.evaluation_score !== null && log.evaluation_score !== undefined ? (
                        <p className="mt-2 text-sm font-semibold text-[#065f52]">
                          Final Score: {log.evaluation_score}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {log.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReview(log.id, "approved")}
                          disabled={reviewingId === log.id}
                          className="rounded-lg bg-[#0a7c6e] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#065f52]"
                        >
                          {reviewingId === log.id ? "Saving..." : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReview(log.id, "rejected")}
                          disabled={reviewingId === log.id}
                          className="rounded-lg bg-[#3db88a] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#0d9e8c]"
                        >
                          {reviewingId === log.id ? "Saving..." : "Reject"}
                        </button>
                      </>
                    ) : null}

                    {canEvaluate ? (
                      <button
                        type="button"
                        onClick={() => openEvaluationForm(log)}
                        className="rounded-lg border border-[#0d9e8c] px-4 py-2 text-sm font-semibold text-[#0a7c6e] transition hover:bg-[#f1fbf8]"
                      >
                        Evaluate
                      </button>
                    ) : null}
                  </div>

                  {activeEvaluationId === log.id ? (
                    <SupervisorEvaluationForm
                      evaluationState={evaluationState}
                      weightedScore={weightedScore}
                      onEvaluationChange={handleEvaluationChange}
                      onSave={saveEvaluation}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
