import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  createWeeklyLog,
  fetchMyWeeklyLogs,
  fetchSupervisorWeeklyLogs,
  reviewWeeklyLog,
  saveWeeklyLogDraft,
  submitWeeklyLogDraft,
} from "../api/api";
import { useAuth } from "./AuthContext";

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    if (!user?.token || !user?.role) {
      setLogs([]);
      setError("");
      return;
    }

    if (!["student", "supervisor"].includes(user.role)) {
      setLogs([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data =
        user.role === "student"
          ? await fetchMyWeeklyLogs()
          : await fetchSupervisorWeeklyLogs();
      setLogs(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load weekly logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [user?.role, user?.token]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const submitLog = async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const createdLog = await createWeeklyLog(payload);
      setLogs((prev) => [...prev, createdLog].sort((a, b) => a.week_number - b.week_number));
      return { success: true, data: createdLog };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to submit weekly log.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async (payload) => {
    setSubmitting(true);
    setError("");

    try {
      const savedDraft = await saveWeeklyLogDraft(payload);
      setLogs((prev) => {
        const existing = prev.some((log) => log.id === savedDraft.id);
        const nextLogs = existing
          ? prev.map((log) => (log.id === savedDraft.id ? savedDraft : log))
          : [...prev, savedDraft];
        return nextLogs.sort((a, b) => a.week_number - b.week_number);
      });
      return { success: true, data: savedDraft };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to save draft.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setSubmitting(false);
    }
  };

  const submitDraft = async (logId, payload) => {
    setSubmitting(true);
    setError("");

    try {
      const submittedLog = await submitWeeklyLogDraft(logId, payload);
      setLogs((prev) => prev.map((log) => (log.id === submittedLog.id ? submittedLog : log)));
      return { success: true, data: submittedLog };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to submit draft.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setSubmitting(false);
    }
  };

  const reviewLog = async (logId, payload) => {
    setReviewingId(logId);
    setError("");

    try {
      const updatedLog = await reviewWeeklyLog(logId, payload);
      setLogs((prev) => prev.map((log) => (log.id === logId ? updatedLog : log)));
      return { success: true, data: updatedLog };
    } catch (err) {
      const message = err.response?.data?.error || "Failed to review weekly log.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        loading,
        error,
        submitting,
        reviewingId,
        loadLogs,
        saveDraft,
        submitLog,
        submitDraft,
        reviewLog,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLogs = () => useContext(LogContext);
