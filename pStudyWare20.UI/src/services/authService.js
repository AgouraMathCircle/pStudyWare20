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
        const loginAt = new Date().toISOString();
        const volunteerAvailability = String(
          response.data?.volunteerAvailability ??
            response.data?.VolunteerAvailability ??
            "N",
        )
          .trim()
          .toUpperCase();
        const userDataToStore = {
          token,
          userId,
          email: userEmail,
          role,
          expiresAt,
          loginAt,
          ...userData,
          username:
            response.data?.username ??
            response.data?.Username ??
            userData?.username ??
            userData?.Username ??
            "",
          volunteerAvailability,
          VolunteerAvailability: volunteerAvailability,
        };

        console.log("Storing user data:", {
          ...userDataToStore,
          expiresAt,
          expiresAtParsed: new Date(expiresAt).toISOString(),
          currentTime: new Date().toISOString(),
        });

        localStorage.setItem(config.auth.tokenKey, token);
        localStorage.setItem(
          config.auth.userDataKey,
          JSON.stringify(userDataToStore),
        );
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

  // Change password (authenticated user; account resolved from JWT on the server)
  async changePassword(currentPassword, password) {
    try {
      const response = await api.post(
        "/auth/change-password",
        {
          currentPassword,
          password,
        },
        {
          // Password change itself is fast; avoid false "API unreachable" when SMTP hangs.
          timeout: Math.max(config.api.timeout || 10000, 30000),
        },
      );
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status === 400 && data) {
        const msg =
          data.message ||
          data.Message ||
          (Array.isArray(data.errors) ? data.errors.join(" ") : null);
        if (data.isSuccess === false || data.IsSuccess === false || msg) {
          return {
            isSuccess: false,
            message: msg || "Failed to change password. Please try again.",
          };
        }
      }
      throw this.handleError(error);
    }
  }

  /** @deprecated Use changePassword */
  async updatePassword(currentPassword, password) {
    return this.changePassword(currentPassword, password);
  }

  // Get current user
  getCurrentUser() {
    console.log("key", config.auth.userDataKey);

    const user = localStorage.getItem(config.auth.userDataKey);
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (!token) {
      console.log("isAuthenticated: No token found");
      return false;
    }

    // Check token expiration
    const expired = this.isTokenExpired();
    if (expired) {
      console.log("isAuthenticated: Token expired, clearing auth data");
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.userDataKey);
      return false;
    }

    return true;
  }

  // Check if token is expired
  isTokenExpired() {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.expiresAt) return true;

      // Parse the expiresAt timestamp (backend sends UTC)
      const expiryTime = new Date(user.expiresAt).getTime();
      const currentTime = Date.now();

      // Add a small buffer (5 seconds) to prevent edge cases
      const isExpired = currentTime >= expiryTime - 5000;

      if (isExpired) {
        console.log("Token expired", {
          expiresAt: user.expiresAt,
          expiryTime: new Date(expiryTime).toISOString(),
          currentTime: new Date(currentTime).toISOString(),
          difference: (expiryTime - currentTime) / 1000 + " seconds",
        });
      }

      return isExpired;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  // Check if user is a student
  isStudent() {
    const user = this.getCurrentUser();
    if (!user) return false;

    return (
      user.role === "Student" ||
      (user.memberType && user.memberType.toUpperCase() === "S")
    );
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.role === role;
  }

  // Check if user has specific member type
  hasMemberType(memberType) {
    const user = this.getCurrentUser();
    if (!user) return false;

    return (
      user.memberType &&
      user.memberType.toUpperCase() === memberType.toUpperCase()
    );
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
      // Network/CORS/timeout - no response received.
      if (error.code === "ECONNABORTED") {
        return new Error(
          "The request timed out. Please try again. If this keeps happening, verify the API server is running.",
        );
      }
      return new Error(
        `Unable to reach the API at ${config.api.url}. Please verify the API server is running and accessible.`,
      );
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new AuthService();
