import api from "./api";

const STUDENT_DASHBOARD_API_BASE_URL = "/StudentDashboard";

const studentDashboardService = {
  /**
   * Gets complete dashboard data for student
   * @param {string} username - Student username
   * @param {number} chapterId - Chapter ID
   * @returns {Promise<object>} Complete dashboard data
   */
  getDashboardData: async (username, chapterId) => {
    try {
      const encoded = encodeURIComponent(username);
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetDashboardData/${encoded}/${chapterId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  /**
   * Gets student profile information
   * @param {string} username - Student username
   * @param {number} chapterId - Chapter ID
   * @returns {Promise<object>} Student profile data
   */
  getStudentProfile: async (username, chapterId) => {
    try {
      const encoded = encodeURIComponent(username);
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetStudentProfile/${encoded}/${chapterId}`
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile:", error);
      throw error;
    }
  },

  /**
   * Gets student profile information by Student ID
   * @param {number} studentId - Student ID
   * @returns {Promise<object>} Student profile data
   */
  getStudentProfileById: async (studentId) => {
    try {
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetStudentProfileById/${studentId}`
      );
      console.log("API Response (by ID):", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile by ID:", error);
      throw error;
    }
  },

  /**
   * Gets multiple student profiles
   * @param {string} username - Student username
   * @param {number} chapterId - Chapter ID
   * @returns {Promise<object>} Multiple student profiles data
   */
  getStudentProfiles: async (username, chapterId) => {
    try {
      const encoded = encodeURIComponent(username);
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetStudentProfiles/${encoded}/${chapterId}`
      );
      console.log("API Response (multiple profiles):", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student profiles:", error);
      throw error;
    }
  },

  /**
   * Updates student profile (UpdateProfile.aspx — AMC_spUpdateStudentProfile).
   * @param {object} body - UpdateStudentProfileRequest (camelCase)
   */
  updateStudentProfile: async (body) => {
    const response = await api.post(
      `${STUDENT_DASHBOARD_API_BASE_URL}/UpdateStudentProfile`,
      body
    );
    return response.data;
  },

  /**
   * Gets student report card/grades
   * @param {string} username - Student username
   * @returns {Promise<object>} Report card data
   */
  getReportCard: async (username) => {
    try {
      const encoded = encodeURIComponent(username);
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetReportCard/${encoded}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching report card:", error);
      throw error;
    }
  },

  /**
   * Gets registration status for student
   * @param {string} username - Student username
   * @returns {Promise<object>} Registration status data
   */
  getRegistrationStatus: async (username) => {
    try {
      const encoded = encodeURIComponent(username);
      const response = await api.get(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetRegistrationStatus/${encoded}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching registration status:", error);
      throw error;
    }
  },

  /**
   * Submits student registration
   * @param {number} studentId - Student ID to register
   * @param {string} username - Student username
   * @returns {Promise<object>} Registration submission result
   */
  submitRegistration: async (studentId, username) => {
    try {
      const response = await api.post(
        `${STUDENT_DASHBOARD_API_BASE_URL}/SubmitRegistration`,
        {
          studentID: studentId,
          username: username,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting registration:", error);
      throw error;
    }
  },

  /**
   * Gets registration information for email notifications
   * @param {number} studentId - Student ID
   * @returns {Promise<object>} Registration information
   */
  getRegistrationInfo: async (studentId) => {
    try {
      const response = await api.post(
        `${STUDENT_DASHBOARD_API_BASE_URL}/GetRegistrationInfo`,
        {
          studentID: studentId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching registration info:", error);
      throw error;
    }
  },

  /**
   * Checks if student is eligible for registration
   * @param {string} username - Student username
   * @returns {Promise<object>} Registration eligibility data
   */
  checkRegistrationEligibility: async (username) => {
    try {
      const response = await api.post(
        `${STUDENT_DASHBOARD_API_BASE_URL}/CheckRegistrationEligibility`,
        {
          username: username,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking registration eligibility:", error);
      throw error;
    }
  },

  /**
   * Updates student profile (redirects to update profile page)
   * @param {number} studentId - Student ID
   */
  updateProfile: (studentId) => {
    // This would typically navigate to the update profile page
    // For now, we'll just log it or handle it in the component
    console.log(`Navigate to update profile for student ID: ${studentId}`);
    // In a real implementation, you might use React Router:
    // navigate(`/update-profile/${studentId}`);
  },
};

export default studentDashboardService;
