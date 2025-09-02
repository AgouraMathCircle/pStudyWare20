import api from "./api";

class TimesheetService {
  constructor() {
    this.baseURL = "/api/Timesheet";
  }

  // Remove timesheet entry
  async timeSheetEntryRemove(logID) {
    try {
      const response = await api.post(`${this.baseURL}/TimeSheetEntryRemove`, {
        logID,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get timesheet list for a user
  async getTimesheetList(userName) {
    try {
      const response = await api.post(`${this.baseURL}/GetTimesheetList`, {
        userName,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add timesheet entry
  async timeSheetEntry(timeSheetEntry) {
    try {
      const response = await api.post(
        `${this.baseURL}/TimeSheetEntry`,
        timeSheetEntry
      );
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
          return new Error(data.message || "Unauthorized access");
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
      // Network error
      return new Error("Network error. Please check your connection.");
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new TimesheetService();
