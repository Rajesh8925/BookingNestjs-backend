// src/api/index.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") { // only run client-side
    const token = localStorage.getItem("token");
    config.headers ??= {};
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // redirect to login page
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
