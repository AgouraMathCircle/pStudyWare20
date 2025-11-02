import api from "./api";

const SENT_EMAIL_API_BASE_URL = "/SentEmail";

const sentEmailService = {
  /**
   * Gets sent messages for the current user
   * @param {string} username - Username (optional, JWT token used if not provided)
   * @returns {Promise<object>} Sent messages response
   */
  getSentMessages: async (username = null) => {
    try {
      const url = username
        ? `${SENT_EMAIL_API_BASE_URL}/GetSentMessages?username=${encodeURIComponent(
            username
          )}`
        : `${SENT_EMAIL_API_BASE_URL}/GetSentMessages`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      throw error;
    }
  },

  /**
   * Gets specific message details by email ID
   * @param {number} emailId - Email ID
   * @returns {Promise<object>} Message details response
   */
  getMessageDetails: async (emailId) => {
    try {
      const response = await api.get(
        `${SENT_EMAIL_API_BASE_URL}/GetMessageDetails/${emailId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching message details:", error);
      throw error;
    }
  },
};

export default sentEmailService;
