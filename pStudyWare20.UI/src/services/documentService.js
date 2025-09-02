import api from "./api";

class DocumentService {
  constructor() {
    this.baseURL = "/api/Document";
  }

  // Get class materials for a user
  async getClassMaterials(userName) {
    try {
      const response = await api.post(`${this.baseURL}/GetClassMaterials`, {
        userName,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Publish a document
  async publishDocument(docID) {
    try {
      const response = await api.post(`${this.baseURL}/PublishDocument`, {
        docID,
      });
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

export default new DocumentService();
