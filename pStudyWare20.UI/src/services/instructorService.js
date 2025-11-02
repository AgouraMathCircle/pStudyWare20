import api from "./api";

/**
 * Instructor Service
 * Handles all instructor-related API calls
 */
const instructorService = {
  /**
   * Get instructor list
   * @param {string} username - Username for authorization
   * @returns {Promise<Object>} Instructor list response
   */
  getInstructorList: async (username) => {
    try {
      const response = await api.post("/Instructor/GetInstructorList", {
        username,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching instructor list:", error);
      throw error;
    }
  },

  /**
   * Add or update instructor
   * @param {Object} instructorData - Instructor data
   * @returns {Promise<Object>} Operation response
   */
  addOrUpdateInstructor: async (instructorData) => {
    try {
      const response = await api.post(
        "/Instructor/AddOrUpdateInstructor",
        instructorData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding/updating instructor:", error);
      throw error;
    }
  },

  /**
   * Delete instructor
   * @param {number} instructorID - Instructor ID
   * @returns {Promise<Object>} Operation response
   */
  deleteInstructor: async (instructorID) => {
    try {
      const response = await api.post("/Instructor/DeleteInstructor", {
        instructorID,
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting instructor:", error);
      throw error;
    }
  },

  /**
   * Export instructor list to Excel
   * @param {string} username - Username for authorization
   * @returns {Promise<Blob>} Excel file blob
   */
  exportInstructorListToExcel: async (username) => {
    try {
      const response = await api.post(
        "/Instructor/ExportInstructorListToExcel",
        { username },
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting instructor list to Excel:", error);
      throw error;
    }
  },

  /**
   * Download Excel file from blob
   * @param {Blob} blob - Excel file blob
   * @param {string} filename - Filename for download
   */
  downloadExcelFile: (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default instructorService;

