import api from "./api";
import config, { getPublicDocumentUrl } from "../utils/config";
import { parseBlobError } from "../utils/excelExport";

const inFlightRequests = new Map();

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
    const normalizedUsername = (username || "").trim();
    const requestKey = `GetDocumentsList:${normalizedUsername}`;

    if (inFlightRequests.has(requestKey)) {
      return inFlightRequests.get(requestKey);
    }

    const requestPromise = (async () => {
      try {
        // Use capitalized Username as expected by backend DTO
        const response = await api.post(
          "/Document/GetDocumentsList",
          {
            Username: normalizedUsername,
          },
          {
            timeout: 60000, // Give DB-bound document lookup enough time
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching documents list:", error);
        throw error;
      } finally {
        inFlightRequests.delete(requestKey);
      }
    })();

    inFlightRequests.set(requestKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      // Cleanup is handled in requestPromise.finally. Kept to make flow explicit.
    }
  },

  /** Clear cached in-flight list request (call after upload/delete/publish). */
  clearDocumentsListCache: (username) => {
    const normalizedUsername = (username || "").trim();
    inFlightRequests.delete(`GetDocumentsList:${normalizedUsername}`);
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
   * Upload Docs Repository file (Word/Excel/PowerPoint)
   * @param {Object} documentData - Repository upload payload
   * @returns {Promise<Object>} Upload response
   */
  uploadRepositoryDocument: async (documentData) => {
    try {
      const response = await api.post(
        "/Document/UploadRepositoryDocument",
        documentData,
        {
          timeout: 60000,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading repository document:", error);
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
          DocID: String(docID ?? ""),
          DocName: docName ?? "",
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
   * Download document via API (class materials).
   * @param {string} docName - Document name
   * @returns {Promise<void>}
   */
  downloadClassMaterial: async (docName) =>
    documentService.downloadDocumentFromApi(
      docName,
      "/Document/DownloadClassMaterial"
    ),

  /**
   * Download a document file via API.
   * @param {string} docName - Document name
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<void>}
   */
  downloadDocumentFromApi: async (docName, endpoint) => {
    if (!docName) {
      return;
    }

    const blob = await documentService.fetchDocumentBlob(docName, endpoint);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download document (static path fallback).
   * @param {string} docName - Document name
   * @param {string} basePath - Base path for documents
   * @returns {void}
   */
  downloadDocument: (docName, basePath = config.paths.publicDocuments) => {
    const url =
      basePath === config.paths.publicDocuments
        ? getPublicDocumentUrl(docName)
        : `${basePath}${docName}`;
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
  viewDocument: (docName, basePath = config.paths.publicDocuments) => {
    const url =
      basePath === config.paths.publicDocuments
        ? getPublicDocumentUrl(docName)
        : `${basePath}${docName}`;
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
   * Get student list for document upload (legacy DisplayMode = "H").
   * @param {string} username - Portal username
   * @returns {Promise<Object>} Student list response
   */
  getStudentListForDocuments: async (username) => {
    try {
      const response = await api.post(
        "/StudentScore/GetStudentList",
        {
          username,
          type: "H",
        },
        {
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student list for documents:", error);
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
          documentID,
          documentName,
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
   * Fetch class material PDF from API storage.
   * @param {string} docName - Document file name
   * @returns {Promise<Blob>} PDF blob
   */
  fetchClassMaterialBlob: async (docName) =>
    documentService.fetchDocumentBlob(docName, "/Document/ViewClassMaterial"),

  /**
   * Fetch a document file from an API endpoint.
   * @param {string} docName - Document file name
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<Blob>} PDF blob
   */
  fetchDocumentBlob: async (docName, endpoint) => {
    try {
      const response = await api.get(endpoint, {
        params: { fileName: docName },
        responseType: "blob",
        timeout: 60000,
      });

      const blob = response.data;
      const contentType = response.headers?.["content-type"] || "";

      if (
        blob instanceof Blob &&
        (contentType.includes("application/json") || blob.type.includes("json"))
      ) {
        const message = await parseBlobError(blob);
        throw new Error(message || "Unable to open document.");
      }

      return blob instanceof Blob
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    } catch (error) {
      if (error.response?.status === 401) {
        console.error(
          `[documentService] Unauthorized (401) fetching ${endpoint} for "${docName}". ` +
            "Ensure you are logged in and the API JWT settings match the login server.",
        );
      }
      if (error.response?.data instanceof Blob) {
        throw new Error(await parseBlobError(error.response.data));
      }
      throw error;
    }
  },

  /**
   * Fetch student document file from API storage.
   * @param {string} docName - Document file name
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<Blob>} PDF blob
   */
  fetchStudentDocumentBlob: async (docName, endpoint) =>
    documentService.fetchDocumentBlob(docName, endpoint),

  /**
   * View student document in new window
   * @param {string} docName - Document name
   * @returns {Promise<void>}
   */
  viewStudentDocument: async (docName) => {
    if (!docName) {
      return;
    }

    const blob = await documentService.fetchStudentDocumentBlob(
      docName,
      "/Document/ViewStudentDocument"
    );
    const pdfBlob =
      blob.type && blob.type !== "application/octet-stream"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");

    if (!newWindow) {
      window.URL.revokeObjectURL(url);
      throw new Error(
        "Unable to open document. Please allow popups for this site."
      );
    }

    setTimeout(() => window.URL.revokeObjectURL(url), 120000);
  },

  /**
   * Download student document
   * @param {string} docName - Document name
   * @returns {Promise<void>}
   */
  downloadStudentDocument: async (docName) => {
    if (!docName) {
      return;
    }

    const blob = await documentService.fetchStudentDocumentBlob(
      docName,
      "/Document/DownloadStudentDocument"
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

/** Normalize API success flag (camelCase or PascalCase). */
export const isDocumentApiSuccess = (response) =>
  response?.isSuccess === true || response?.IsSuccess === true;

/** Normalize documents array from list/repository API responses. */
export const getDocumentApiList = (response) => {
  const docs = response?.documents ?? response?.Documents ?? [];
  return Array.isArray(docs) ? docs : [];
};

export const getRepositoryDocumentName = (doc) =>
  doc?.docName ?? doc?.mDocName ?? doc?.DocName ?? "";

/** AMC_spDeleteDocuments @DocID = DocumentID (table key), not display row mDocID. */
export const getClassMaterialDeleteId = (doc) => {
  const id = doc?.documentID ?? doc?.DocumentID;
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/** AMC_spDeleteDocuments @DocID = API documentID (table mDocID), not display row docID. */
export const getStudentDocumentDeleteId = (doc) => {
  const id = doc?.documentID ?? doc?.DocumentID;
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "";
};

export const getStudentDocumentName = (doc) =>
  doc?.documentName ?? doc?.DocumentName ?? "";

export default documentService;
