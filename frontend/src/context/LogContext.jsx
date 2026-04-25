import { createContext, useContext, useEffect, useState } from "react";
import {
  createWeeklyLog,
  fetchMyWeeklyLogs,
  fetchSupervisorWeeklyLogs,
  reviewWeeklyLog,
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

  const loadLogs = async () => {
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
  };

  useEffect(() => {
    loadLogs();
  }, [user?.token, user?.role]);

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
        submitLog,
        reviewLog,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);
