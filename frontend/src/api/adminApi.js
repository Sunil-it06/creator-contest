import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;