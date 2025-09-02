import api from './api';

class StudentService {
  constructor() {
    this.baseURL = '/api/StudentRegistration';
  }

  // Register a new student
  async registerStudent(studentData) {
    try {
      const response = await api.post(`${this.baseURL}/StudentRegistration`, studentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get students list
  async getStudentsList(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetStudentsList`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student report card
  async getStudentsReportCard(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetStudentsReportCard`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update student report card
  async updateStudentsReportCard(request) {
    try {
      const response = await api.post(`${this.baseURL}/UpdateStudentsReportCard`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get meeting schedule
  async getMeetingSchedule(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetMeetingSchedule`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get dashboard message
  async getDashboardMessage(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetDashboardMessage`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student detail
  async getStudentDetail(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetStudentDetail`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update student detail
  async updateStudentDetail(request) {
    try {
      const response = await api.post(`${this.baseURL}/UpdateStudentDetail`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get report card with additional details
  async getReportcard(request) {
    try {
      const response = await api.post(`${this.baseURL}/GetReportcard`, request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get available locations (mock data for now)
  async getLocations() {
    // Mock data - replace with actual API call when backend is ready
    return [
      { value: "0", text: "--Select--" },
      { value: "1", text: "Agoura Math Circle - El Camino Real High School, Woodland Hills" },
      { value: "2", text: "VIRTUAL Math Circle - Internet" },
      { value: "3", text: "Irvine Math Circle - Beacon Park School, Irvine" },
      { value: "4", text: "Introduction to Artificial Intelligence - Internet , Agoura Hills" },
      { value: "6", text: "ACT - Internet , Agoura Hills" }
    ];
  }

  // Get session options (mock data for now)
  async getSessions() {
    return [
      { value: "0", text: "--Select--" },
      { value: "S2025", text: "Spring Semester 2025" }
    ];
  }

  // Get grade options (mock data for now)
  async getGrades() {
    return [
      { value: "0", text: "--Select--" },
      { value: "1", text: "1" },
      { value: "2", text: "2" },
      { value: "3", text: "3" },
      { value: "4", text: "4" },
      { value: "5", text: "5" },
      { value: "6", text: "6" },
      { value: "7", text: "7" },
      { value: "8", text: "8" },
      { value: "9", text: "9" },
      { value: "10", text: "10" },
      { value: "11", text: "11" },
      { value: "12", text: "12" }
    ];
  }

  // Get countries (mock data for now)
  async getCountries() {
    return [
      { value: "US", text: "United States" },
      { value: "CA", text: "Canada" },
      { value: "GB", text: "United Kingdom" },
      { value: "CN", text: "China" },
      { value: "IN", text: "India" },
      { value: "SG", text: "Singapore" },
      { value: "MX", text: "Mexico" },
      { value: "MY", text: "Malaysia" },
      // Add more countries as needed
    ];
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid request data');
        case 401:
          return new Error(data.message || 'Unauthorized access');
        case 403:
          return new Error(data.message || 'Access denied');
        case 404:
          return new Error(data.message || 'Resource not found');
        case 422:
          return new Error(data.message || 'Validation failed');
        case 500:
          return new Error(data.message || 'Internal server error');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new StudentService();
