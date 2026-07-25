import api from "./api";
import { downloadExcelBlob, postExcelExport } from "../utils/excelExport";

const ADMIN_DASHBOARD_API_BASE_URL = "/AdminDashboard";

const normalizeGetResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  hasValue: Boolean(body.hasValue ?? body.HasValue),
  response: String(body.response ?? body.Response ?? "").trim(),
  comments: String(body.comments ?? body.Comments ?? "").trim(),
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
  message: body.message ?? body.Message ?? "",
});

const normalizeUpdateResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  message: body.message ?? body.Message ?? "",
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
  session: String(body.session ?? body.Session ?? "").trim(),
  summaryData: Array.isArray(body.summaryData ?? body.SummaryData)
    ? body.summaryData ?? body.SummaryData
    : [],
});

const buildAvailabilityRequestPayload = (request = {}) => ({
  userID: String(request.userID ?? request.userId ?? request.UserID ?? ""),
  session: String(request.session ?? request.Session ?? "").trim(),
  semester: String(request.semester ?? request.Semester ?? "").trim(),
  response: request.response ?? request.Response,
  comment: request.comment ?? request.comments ?? request.Comment ?? "",
});

const normalizeSummaryResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  summaryData: Array.isArray(body.summaryData ?? body.SummaryData)
    ? body.summaryData ?? body.SummaryData
    : [],
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
});

const normalizeFormContextResponse = (body = {}) => ({
  isSuccess: body.isSuccess ?? body.IsSuccess ?? true,
  currentSession: String(body.currentSession ?? body.CurrentSession ?? "").trim(),
  targetSession: String(body.targetSession ?? body.TargetSession ?? "").trim(),
  volunteeringPrompt: String(
    body.volunteeringPrompt ?? body.VolunteeringPrompt ?? "",
  ).trim(),
  semester: String(body.semester ?? body.Semester ?? "").trim(),
  errorMessage: body.errorMessage ?? body.ErrorMessage ?? "",
});

/** Chapter Admin volunteer-availability API (AdminDashboard), not shared Instructor/SystemAdmin routes. */
export const adminVolunteerAvailabilityApi = {
  getFormContext: async () => {
    const response = await api.post(
      `${ADMIN_DASHBOARD_API_BASE_URL}/GetVolunteerAvailabilityFormContext`,
      {},
    );
    return normalizeFormContextResponse(response.data);
  },

  getAvailability: async (request) => {
    const payload = buildAvailabilityRequestPayload(request);
    const response = await api.post(
      `${ADMIN_DASHBOARD_API_BASE_URL}/GetVolunteerAvailability`,
      {
        userID: payload.userID,
        session: payload.session,
        semester: payload.semester,
      },
    );
    return normalizeGetResponse(response.data);
  },

  updateAvailability: async (request) => {
    const payload = buildAvailabilityRequestPayload(request);
    const response = await api.post(
      `${ADMIN_DASHBOARD_API_BASE_URL}/UpdateVolunteerAvailability`,
      {
        userID: payload.userID,
        session: payload.session,
        semester: payload.semester,
        response: payload.response,
        comment: payload.comment,
      },
    );
    return normalizeUpdateResponse(response.data);
  },

  getAvailabilitySummary: async (request) => {
    const response = await api.post(
      `${ADMIN_DASHBOARD_API_BASE_URL}/GetVolunteerAvailabilitySummary`,
      request,
    );
    return normalizeSummaryResponse(response.data);
  },
};

const adminDashboardService = {
  /**
   * Gets Chapter Admin dashboard data (student list only).
   * To Do / Enrolled / Waiting widgets live on SystemAdmin only.
   * @param {string} username - Admin username (optional, JWT token used if not provided)
   * @returns {Promise<object>} Dashboard data including student list
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

  getVolunteerAvailabilityFormContext:
    adminVolunteerAvailabilityApi.getFormContext,
  getVolunteerAvailability: adminVolunteerAvailabilityApi.getAvailability,
  updateVolunteerAvailability: adminVolunteerAvailabilityApi.updateAvailability,
  getVolunteerAvailabilitySummary:
    adminVolunteerAvailabilityApi.getAvailabilitySummary,

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
