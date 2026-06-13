import api from "./api";
import { downloadExcelBlob, postExcelExport } from "../utils/excelExport";

const ADMIN_DASHBOARD_API_BASE_URL = "/AdminDashboard";

const adminDashboardService = {
  /**
   * Gets complete dashboard data for admin (combined endpoint for efficiency)
   * @param {string} username - Admin username (optional, JWT token used if not provided)
   * @returns {Promise<object>} Complete dashboard data including student list, tracking, and message
   */
  getDashboardData: async (username = null) => {
    try {
      const url = username
        ? `${ADMIN_DASHBOARD_API_BASE_URL}/GetDashboardData?username=${encodeURIComponent(
            username
          )}`
        : `${ADMIN_DASHBOARD_API_BASE_URL}/GetDashboardData`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      throw error;
    }
  },

  /**
   * Gets student list for admin dashboard
   * @param {object} request - Student list request parameters
   * @param {string} request.username - Admin username
   * @param {string} request.mode - Mode (D for dashboard)
   * @returns {Promise<object>} Student list response
   */
  getStudentList: async (request) => {
    try {
      const response = await api.post(
        `${ADMIN_DASHBOARD_API_BASE_URL}/GetStudentList`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student list:", error);
      throw error;
    }
  },

  /**
   * Gets user tracking summary for admin dashboard
   * @param {object} request - User tracking summary request parameters
   * @returns {Promise<object>} User tracking summary response
   */
  getUserTrackingSummary: async (request = {}) => {
    try {
      const response = await api.post(
        `${ADMIN_DASHBOARD_API_BASE_URL}/GetUserTrackingSummary`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user tracking summary:", error);
      throw error;
    }
  },

  /**
   * Gets dashboard message with student counts
   * @param {object} request - Dashboard message request parameters
   * @param {string} request.username - Admin username
   * @param {string} request.mode - Mode (A for admin)
   * @returns {Promise<object>} Dashboard message response with student counts
   */
  getDashboardMessage: async (request) => {
    try {
      const response = await api.post(
        `${ADMIN_DASHBOARD_API_BASE_URL}/GetDashboardMessage`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard message:", error);
      throw error;
    }
  },

  /**
   * Publishes documents and optionally sends email notification
   * @param {object} request - Publish document request parameters
   * @param {boolean} request.sendEmail - Whether to send email notification
   * @returns {Promise<object>} Publish document response
   */
  publishDocument: async (request) => {
    try {
      const response = await api.post(
        `${ADMIN_DASHBOARD_API_BASE_URL}/PublishDocument`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error publishing document:", error);
      throw error;
    }
  },

  /**
   * Exports student list to Excel file
   * @param {object} request - Export Excel request parameters
   * @param {string} request.username - Admin username
   * @param {string} request.mode - Mode (D for dashboard)
   * @returns {Promise<Blob>} Excel file as blob
   */
  exportStudentListToExcel: async (request) => {
    try {
      const fileName = await postExcelExport(
        api,
        `${ADMIN_DASHBOARD_API_BASE_URL}/ExportStudentListToExcel`,
        request,
        "StudentList.xlsx"
      );
      return { isSuccess: true, fileName };
    } catch (error) {
      console.error("Error exporting student list to Excel:", error);
      throw error;
    }
  },

  /**
   * Checks if current user has admin privileges
   * @returns {Promise<object>} Admin privilege status
   */
  getUserTrackingList: async (request) => {
    try {
      const response = await api.post(
        `${ADMIN_DASHBOARD_API_BASE_URL}/GetUserTrackingList`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user tracking list:", error);
      throw error;
    }
  },

  checkAdminPrivileges: async () => {
    try {
      const response = await api.get(
        `${ADMIN_DASHBOARD_API_BASE_URL}/CheckAdminPrivileges`,
        {
          timeout: 30000, // align with admin data operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking admin privileges:", error);
      throw error;
    }
  },

  /**
   * Helper function to download Excel file from blob
   * @param {Blob} blob - File blob
   * @param {string} filename - Filename for download
   */
  downloadExcelFile: (blob, filename = "StudentList.xlsx") => {
    downloadExcelBlob(blob, filename);
  },
};

export default adminDashboardService;
