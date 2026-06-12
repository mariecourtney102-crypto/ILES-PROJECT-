import { Save, Star } from "lucide-react";

const FALLBACK_CRITERIA_ROWS = [
  {
    criteria_id: 1,
    criteria_name: "Technical Skills",
    criteria: "technical",
    score: "",
    comment: "",
  },
  {
    criteria_id: 2,
    criteria_name: "Cognitive Skills",
    criteria: "cognitive",
    score: "",
    comment: "",
  },
  {
    criteria_id: 3,
    criteria_name: "Soft Skills",
    criteria: "soft",
    score: "",
    comment: "",
  },
  {
    criteria_id: 4,
    criteria_name: "Professionalism",
    criteria: "professional",
    score: "",
    comment: "",
  },
];

export const createFallbackEvaluationRows = () =>
  FALLBACK_CRITERIA_ROWS.map((row) => ({ ...row }));

export default function SupervisorEvaluationForm({
  evaluationState,
  weightedScore,
  onEvaluationChange,
  onSave,
}) {
  const rows = evaluationState.rows.length
    ? evaluationState.rows
    : createFallbackEvaluationRows();

  return (
    <div className="mt-4 rounded-xl border border-[#c7f2e8] bg-[#f1fbf8] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#065f52]">Evaluation Form</p>
          <p className="text-sm text-[#065f52]/80">
            Enter whole-number scores from 0 to 100 for each criterion. Each criterion contributes 25% to the final score.
          </p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#0a7c6e] shadow-sm">
          Final Score: {weightedScore ?? evaluationState.weighted_score ?? "Pending"}
        </div>
      </div>

      {evaluationState.loading ? (
        <p className="mt-4 text-sm text-[#065f52]">Loading criteria...</p>
      ) : null}

      {evaluationState.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{evaluationState.error}</p>
      ) : null}

      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.criteria_id} className="rounded-xl border border-white/60 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-800">{row.criteria_name}</p>
                <p className="text-sm text-gray-500 capitalize">{row.criteria}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#f1fbf8] px-3 py-1 text-sm text-[#065f52]">
                <Star size={14} />
                25%
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[120px_1fr]">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  value={row.score}
                  onChange={(e) => onEvaluationChange(row.criteria_id, "score", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#0d9e8c]"
                  disabled={evaluationState.saving}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Comment
                </label>
                <input
                  type="text"
                  value={row.comment}
                  onChange={(e) => onEvaluationChange(row.criteria_id, "comment", e.target.value)}
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#0d9e8c]"
                  disabled={evaluationState.saving}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={evaluationState.saving}
          className="inline-flex items-center gap-2 rounded-lg border border-[#0d9e8c] px-4 py-2 text-sm font-semibold text-[#0a7c6e] transition hover:bg-[#f1fbf8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={16} />
          {evaluationState.saving ? "Saving..." : "Save Evaluation"}
        </button>
      </div>
    </div>
  );
}
