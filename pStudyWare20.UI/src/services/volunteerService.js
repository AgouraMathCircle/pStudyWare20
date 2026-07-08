import api from "./api";
import studentService from "./studentService";
import registrationLookupService from "./registrationLookupService";

class VolunteerService {
  // Register a new volunteer
  async registerVolunteer(volunteerData) {
    try {
      const response = await api.post(
        "/VolunteerRegistration/VolunteerRegistration",
        volunteerData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get available locations (mock data for now)
  async getLocations() {
    return registrationLookupService.getLocations();
  }

  // Get session options from AMC_tblLookupSemester (Semester + LastSemester)
  async getSessions() {
    return registrationLookupService.getSemesters();
  }

  // Get grade options (mock data for now)
  async getGrades() {
    return [
      { value: "High School Freshman", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" },
      { value: "UG", label: "UG" },
      { value: "Graduate", label: "Graduate" },
      { value: "PhD", label: "PhD" },
      { value: "Others", label: "Others" },
    ];
  }

  // Get interested options (mock data for now)
  async getInterestedOptions() {
    return [
      { value: "Tutoring", label: "Tutoring" },
      { value: "Document Review", label: "Document Reviewer" },
      { value: "Class Coordinator", label: "Class Coordinator" },
      { value: "Facility Inspection", label: "Facility Inspection" },
      { value: "Grading", label: "Grading" },
      { value: "Yard Duty", label: "Yard Duty" },
      { value: "Others", label: "Others" },
    ];
  }

  // Get countries (same list as student registration)
  async getCountries() {
    return studentService.getCountries();
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

export default new VolunteerService();
