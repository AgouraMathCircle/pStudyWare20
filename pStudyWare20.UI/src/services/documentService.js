import api from "./api";

/**
 * Document Service
 * Handles all document-related API calls
 */
const documentService = {
  /**
   * Get documents list
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Documents list response
   */
  getDocumentsList: async (username) => {
    try {
      // Use capitalized Username as expected by backend DTO
      const response = await api.post(
        "/Document/GetDocumentsList",
        {
          Username: username,
        },
        {
          timeout: 30000, // 30 seconds for document operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching documents list:", error);
      throw error;
    }
  },

  /**
   * Get documents repository (using AMC_spDocumentsRepository stored procedure)
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Documents repository response
   */
  getDocumentsRepository: async (username) => {
    try {
      const response = await api.post(
        "/Document/GetDocumentsRepository",
        {
          Username: username,
        },
        {
          timeout: 30000, // 30 seconds for document operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching documents repository:", error);
      throw error;
    }
  },

  /**
   * Upload document
   * @param {Object} documentData - Document data including file
   * @returns {Promise<Object>} Upload response
   */
  uploadDocument: async (documentData) => {
    try {
      const response = await api.post(
        "/Document/UploadDocument",
        documentData,
        {
          timeout: 60000, // 60 seconds for file uploads
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  /**
   * Delete document
   * @param {string} docID - Document ID
   * @param {string} docName - Document name
   * @returns {Promise<Object>} Delete response
   */
  deleteDocument: async (docID, docName) => {
    try {
      const response = await api.post(
        "/Document/DeleteDocument",
        {
          DocID: docID,
          DocName: docName,
        },
        {
          timeout: 30000, // 30 seconds for delete operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  /**
   * Publish document
   * @param {number} docID - Document ID
   * @returns {Promise<Object>} Publish response
   */
  publishDocument: async (docID) => {
    try {
      const response = await api.post(
        "/Document/PublishDocument",
        {
          docID,
        },
        {
          timeout: 30000, // 30 seconds for publish operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error publishing document:", error);
      throw error;
    }
  },

  /**
   * Get class materials (legacy support)
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Class materials response
   */
  getClassMaterials: async (username) => {
    try {
      const response = await api.post(
        "/Document/GetClassMaterials",
        {
          username,
        },
        {
          timeout: 30000, // 30 seconds for document operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching class materials:", error);
      throw error;
    }
  },

  /**
   * Download document
   * @param {string} docName - Document name
   * @param {string} basePath - Base path for documents
   * @returns {void}
   */
  downloadDocument: (docName, basePath = "/pStudyWare/Documents/") => {
    const url = `${basePath}${docName}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * View document in new window
   * @param {string} docName - Document name
   * @param {string} basePath - Base path for documents
   * @returns {void}
   */
  viewDocument: (docName, basePath = "/pStudyWare/Documents/") => {
    const url = `${basePath}${docName}`;
    window.open(url, "_blank");
  },

  /**
   * Open video URL
   * @param {string} videoURL - Video URL
   * @returns {void}
   */
  openVideo: (videoURL) => {
    if (videoURL) {
      window.open(videoURL, "_blank");
    }
  },

  /**
   * Convert file to base64
   * @param {File} file - File object
   * @returns {Promise<string>} Base64 string
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix to get just the base64 string
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Convert file to byte array
   * @param {File} file - File object
   * @returns {Promise<Array>} Byte array
   */
  fileToByteArray: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = Array.from(new Uint8Array(arrayBuffer));
        resolve(byteArray);
      };
      reader.onerror = (error) => reject(error);
    });
  },

  // Student Documents methods
  /**
   * Get student documents
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Student documents list response
   */
  getStudentDocuments: async (username) => {
    try {
      const response = await api.post(
        "/Document/GetStudentDocuments",
        {
          Username: username,
        },
        {
          timeout: 30000, // 30 seconds for document operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student documents:", error);
      throw error;
    }
  },

  /**
   * Add student document
   * @param {Object} documentData - Document data including file
   * @returns {Promise<Object>} Upload response
   */
  addStudentDocument: async (documentData) => {
    try {
      const response = await api.post(
        "/Document/AddStudentDocument",
        documentData,
        {
          timeout: 60000, // 60 seconds for file uploads
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding student document:", error);
      throw error;
    }
  },

  /**
   * Delete student document
   * @param {string} documentID - Document ID
   * @param {string} documentName - Document name
   * @returns {Promise<Object>} Delete response
   */
  deleteStudentDocument: async (documentID, documentName) => {
    try {
      const response = await api.post(
        "/Document/DeleteStudentDocument",
        {
          DocumentID: documentID,
          DocumentName: documentName,
        },
        {
          timeout: 30000, // 30 seconds for delete operations
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting student document:", error);
      throw error;
    }
  },

  /**
   * Get current session
   * @param {string} chapterID - Chapter ID (default: "3")
   * @returns {Promise<Object>} Current session response
   */
  getCurrentSession: async (chapterID = "3") => {
    try {
      const response = await api.post(
        "/Document/GetCurrentSession",
        {
          ChapterID: chapterID,
        },
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current session:", error);
      throw error;
    }
  },

  /**
   * Get schedule lookup
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Schedule lookup response
   */
  getScheduleLookup: async (username) => {
    try {
      const response = await api.post(
        "/Document/GetScheduleLookup",
        {
          Username: username,
        },
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule lookup:", error);
      throw error;
    }
  },

  /**
   * Update message center
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Message center response
   */
  updateMessageCenter: async (messageData) => {
    try {
      const response = await api.post(
        "/Document/UpdateMessageCenter",
        messageData,
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating message center:", error);
      throw error;
    }
  },

  /**
   * View student document in new window
   * @param {string} docName - Document name
   * @returns {void}
   */
  viewStudentDocument: (docName) => {
    const url = `/pStudyWare/AMC_Student_Docs/${docName}`;
    window.open(url, "_blank");
  },

  /**
   * Download student document
   * @param {string} docName - Document name
   * @returns {void}
   */
  downloadStudentDocument: (docName) => {
    const url = `/pStudyWare/AMC_Student_Docs/${docName}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default documentService;
