import api from "./api";
import config from "../utils/config";

class ContactService {
  async submitEnquiry(enquiryData) {
    try {
      const response = await api.post("/Contact", enquiryData, {
        timeout: Math.max(config.api.timeout || 10000, 60000),
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.message ||
        "Unable to send your message. Please try again.";
      throw new Error(message);
    }
  }
}

export default new ContactService();
