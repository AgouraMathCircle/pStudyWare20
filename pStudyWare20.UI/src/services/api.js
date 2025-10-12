import axios from "axios";
import config from "../utils/config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and check expiration
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      // Check if token is expired before making request
      const userData = localStorage.getItem(config.auth.userDataKey);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.expiresAt) {
            const expiryTime = new Date(user.expiresAt).getTime();
            const currentTime = new Date().getTime();

            if (currentTime >= expiryTime) {
              // Token expired - clear storage and redirect
              localStorage.removeItem(config.auth.tokenKey);
              localStorage.removeItem(config.auth.userDataKey);
              window.location.href = "/login";
              return Promise.reject(new Error("Token expired"));
            }
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.userDataKey);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
