import api from "./api";

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
        { username: username || "" }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  /**
   * Gets a specific message by ID
   * @param {number} emailId - Email ID
   * @returns {Promise<object>} Get message response
   */
  getMessage: async (emailId) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/GetMessage`,
        { emailID: emailId }
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
        request
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
   * Exports messages to Excel
   * @param {string} username - Username
   * @returns {Promise<Blob>} Excel file blob
   */
  exportMessagesToExcel: async (username) => {
    try {
      const response = await api.post(
        `${EMAIL_MANAGER_API_BASE_URL}/ExportMessagesToExcel`,
        { username },
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Read the blob content as text to add proper Excel HTML headers
      const blobText = await response.data.text();

      // Add proper Excel HTML headers if not already present
      // This ensures Excel recognizes the file format correctly
      const excelHeader =
        '<?xml version="1.0"?>\n' +
        '<?mso-application progid="Excel.Sheet"?>\n' +
        '<html xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
        '      xmlns:x="urn:schemas-microsoft-com:office:excel"\n' +
        '      xmlns="http://www.w3.org/TR/REC-html40">\n';

      // Check if the content already has Excel headers
      let finalContent = blobText;
      if (!blobText.includes('<?mso-application progid="Excel.Sheet"?>')) {
        // Replace <html> with Excel header, preserving all body content
        // The backend returns: <html><body><table>...</table></body></html>
        finalContent = blobText.replace(/^<html[^>]*>/i, excelHeader.trim());
      }

      // Create a new Blob with proper Excel HTML MIME type
      const blob = new Blob([finalContent], {
        type: "application/vnd.ms-excel",
      });

      return blob;
    } catch (error) {
      console.error("Error exporting messages to Excel:", error);
      throw error;
    }
  },
};

export default emailManagerService;
