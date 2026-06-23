import api from "./api";
import { postExcelExport } from "../utils/excelExport";

const EMAIL_MANAGER_API_BASE_URL = "/EmailManager";

const emailManagerService = {
  /**
   * Gets messages for a user (inbox)
   * @param {string} username - Username (optional, JWT token used if not provided)
   * @returns {Promise<object>} Get messages response
   */
  getMessages: async (username = null) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetMessages`,
        { username: username || "" },
        { timeout: 120000 }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  /**
   * Gets unread message count for portal header badge
   * @param {string} username - Username (optional, JWT token used if not provided)
   * @returns {Promise<object>} Get message total response
   */
  getMessageTotal: async (username = null) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetMessageTotal`,
        { username: username || "" },
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching message total:", error);
      throw error;
    }
  },

  /**
   * Gets a specific message by ID
   * @param {number} emailId - Email ID
   * @returns {Promise<object>} Get message response
   */
  getMessage: async (emailId) => {
    const parsedId = Number(emailId);
    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      return {
        isSuccess: false,
        errorMessage: "A valid email ID is required",
      };
    }

    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetMessage`,
        { emailID: parsedId },
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching message:", error);
      throw error;
    }
  },

  /**
   * Sends a new message or reply to a message
   * @param {object} request - Send message request
   * @param {string} request.sendTo - Send to email
   * @param {string} request.sendFrom - Send from email
   * @param {string} request.subject - Subject
   * @param {string} request.message - Message body
   * @param {string} request.sendBy - Send by email
   * @param {number} request.replyToEmailID - Reply to email ID (optional)
   * @param {string} request.mode - Mode (N = New, R = Reply)
   * @param {string} request.chapterID - Chapter ID
   * @param {string} request.memberType - Member type
   * @param {string} request.fromName - From name
   * @returns {Promise<object>} Send message response
   */
  sendMessage: async (request) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/SendMessage`,
        request,
        { timeout: 60000 }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Updates message status (mark as viewed, delete, etc.)
   * @param {object} request - Update message status request
   * @param {number} request.trackingID - Tracking ID
   * @param {string} request.mode - Mode (T = Trash, V = Viewed)
   * @param {string} request.sendTo - Send to email
   * @returns {Promise<object>} Update message status response
   */
  updateMessageStatus: async (request) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/UpdateMessageStatus`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error updating message status:", error);
      throw error;
    }
  },

  /**
   * Gets instructor email groups
   * @param {string} username - Username
   * @returns {Promise<object>} Get instructor email groups response
   */
  getInstructorEmailGroups: async (username) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetInstructorEmailGroups`,
        { username }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching instructor email groups:", error);
      throw error;
    }
  },

  /**
   * Gets student list for email
   * @param {object} request - Get student list request
   * @param {string} request.username - Username
   * @param {string} request.memberType - Member type (I for instructor)
   * @returns {Promise<object>} Get student list for email response
   */
  getStudentListForEmail: async (request) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetStudentListForEmail`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student list for email:", error);
      throw error;
    }
  },

  /**
   * Exports messages to Excel (.xlsx)
   * @param {string} username - Username
   * @returns {Promise<{isSuccess: boolean, fileName: string}>}
   */
  exportMessagesToExcel: async (username) => {
    try {
      const fileName = await postExcelExport(
        api,
        `${EMAIL_MANAGER_API_BASE_URL}/ExportMessagesToExcel`,
        { username },
        "MessageCenter.xlsx"
      );
      return { isSuccess: true, fileName };
    } catch (error) {
      console.error("Error exporting messages to Excel:", error);
      throw error;
    }
  },
};

export default emailManagerService;
