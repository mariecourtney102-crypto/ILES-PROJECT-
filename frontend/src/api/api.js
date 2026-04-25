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

export default api;
