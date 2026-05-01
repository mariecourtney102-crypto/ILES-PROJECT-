import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const publicPaths = ["/login/", "/signup/"];

  if (token && !publicPaths.includes(config.url)) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});


export const loginUser = async (username, password) => {
  const res = await api.post("/login/", { username, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("name", res.data.name);
  return res.data;
};


export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
};

export const getUserProfile = async () => {
  const res = await api.get("/profile/");
  return res.data;
};

export const updateUserProfile = async (payload) => {
  const res = await api.put("/profile/", payload);
  return res.data;
};

export const logoutAPI = async () => {
  const res = await api.post("/logout/");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get("/dashboard/");
  return res.data;
};

export const searchInternships = async (query) => {
  const res = await api.get("/search-internships/", { params: { q: query } });
  return res.data;
};

export const fetchMyWeeklyLogs = async () => {
  const res = await api.get("/weekly-logs/my/");
  return res.data;
};

export const createWeeklyLog = async (payload) => {
  const res = await api.post("/weekly-logs/create/", payload);
  return res.data;
};

export const saveWeeklyLogDraft = async (payload) => {
  const res = await api.post("/weekly-logs/draft/", payload);
  return res.data;
};

export const submitWeeklyLogDraft = async (logId, payload) => {
  const res = await api.patch(`/weekly-logs/${logId}/submit/`, payload);
  return res.data;
};

export const fetchSupervisorWeeklyLogs = async (studentId) => {
  const res = await api.get("/supervisor/weekly-logs/", {
    params: studentId ? { student_id: studentId } : {},
  });
  return res.data;
};

export const fetchSupervisorStudents = async () => {
  const res = await api.get("/supervisor/students/");
  return res.data;
};

export const reviewWeeklyLog = async (logId, payload) => {
  const res = await api.patch(`/supervisor/weekly-logs/${logId}/review/`, payload);
  return res.data;
};

export const fetchPlacement = async () => {
  const res = await api.get("/placement/");
  return res.data;
};

export const createPlacement = async (payload) => {
  const res = await api.post("/placement/create/", payload);
  return res.data;
};

export const updatePlacement = async (payload) => {
  const res = await api.put("/placement/update/", payload);
  return res.data;
};

export const deletePlacement = async () => {
  const res = await api.delete("/placement/delete/");
  return res.data;
};

export const fetchNotifications = async () => {
  const res = await api.get("/notifications/");
  return res.data;
};

export const markNotificationRead = async (notificationId) => {
  const res = await api.patch(`/notifications/${notificationId}/read/`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.patch("/notifications/read-all/");
  return res.data;
};

export default api;
