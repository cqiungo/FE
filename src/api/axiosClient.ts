// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://be-3-xja1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log(token)
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

export default axiosClient;
