import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default userApi;