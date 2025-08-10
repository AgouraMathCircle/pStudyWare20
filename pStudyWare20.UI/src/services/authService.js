import api from "./api";
import config from "../utils/config";

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      const {
        token,
        userId,
        email: userEmail,
        role,
        expiresAt,
        ...userData
      } = response.data;

      if (token) {
        localStorage.setItem(config.auth.tokenKey, token);
        localStorage.setItem(
          config.auth.userDataKey,
          JSON.stringify({
            token,
            userId,
            email: userEmail,
            role,
            expiresAt,
            ...userData,
          })
        );
        console.log("User data stored:", userData);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout() {
    console.log("Logout called - clearing authentication state");
    
    // Clear all authentication data immediately
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userDataKey);
    
    console.log("Authentication data cleared from localStorage");
    
    // Force immediate state update by dispatching events synchronously
    try {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("authLogout"));
      console.log("Events dispatched successfully");
    } catch (error) {
      console.error("Error dispatching events:", error);
    }
    
    // Force a complete page reload to ensure all state is reset
    console.log("Forcing page reload to login page");
    window.location.replace("/login");
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    console.log("key", config.auth.userDataKey);

    const user = localStorage.getItem(config.auth.userDataKey);
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(config.auth.tokenKey);
  }

  // Get auth token
  getToken() {
    return localStorage.getItem(config.auth.tokenKey);
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post("/auth/refresh-token");
      if (response.data.token) {
        localStorage.setItem(config.auth.tokenKey, response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate token
  async validateToken() {
    try {
      const response = await api.get("/auth/validate-token");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new Error(data.message || "Invalid request data");
        case 401:
          return new Error(data.message || "Invalid credentials");
        case 403:
          return new Error(data.message || "Access denied");
        case 404:
          return new Error(data.message || "Resource not found");
        case 422:
          return new Error(data.message || "Validation failed");
        case 500:
          return new Error(data.message || "Internal server error");
        default:
          return new Error(data.message || "An error occurred");
      }
    } else if (error.request) {
      // Network error - provide more helpful message
      return new Error(
        "Network error. Please check if the API server is running on https://localhost:7146"
      );
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new AuthService();
