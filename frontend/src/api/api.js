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

export const fetchMyWeeklyLogs = async () => {
  const res = await api.get("/weekly-logs/my/");
  return res.data;
};

export const createWeeklyLog = async (payload) => {
  const res = await api.post("/weekly-logs/create/", payload);
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

export default api;
