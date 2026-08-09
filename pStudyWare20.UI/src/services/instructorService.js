import api from "./api";
import { downloadExcelBlob, postExcelExport } from "../utils/excelExport";

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
      const memberStatus =
        instructorData?.memberStatus ?? instructorData?.MemberStatus ?? "1";
      const payload = {
        instructorID: Number(
          instructorData?.instructorID ?? instructorData?.InstructorID ?? 0,
        ),
        firstName: instructorData?.firstName ?? instructorData?.FirstName ?? "",
        lastName: instructorData?.lastName ?? instructorData?.LastName ?? "",
        emailID: instructorData?.emailID ?? instructorData?.EmailID ?? "",
        contactPhone:
          instructorData?.contactPhone ?? instructorData?.ContactPhone ?? "",
        chapterID: String(
          instructorData?.chapterID ?? instructorData?.ChapterID ?? "",
        ),
        class:
          instructorData?.class ??
          instructorData?.Class ??
          instructorData?.classCode ??
          "",
        section: instructorData?.section ?? instructorData?.Section ?? "A",
        
        instructorType:
          instructorData?.instructorType ??
          instructorData?.InstructorType ??
          "P",
        LastLogin: String(
          instructorData?.LastLogin ?? instructorData?.LastLogin ?? "",
        ),
        memberStatus: String(
          memberStatus === "0" ||
            String(memberStatus).trim().toLowerCase() === "inactive" ||
            String(memberStatus).trim().toLowerCase() === "deactive"
            ? "0"
            : "1",
        ),
      };

      const response = await api.post(
        "/Instructor/AddOrUpdateInstructor",
        payload,
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

  addMemberToGroup: async (groupEmail, userEmail) => {
    try {
      const response = await api.post(`/GoogleWorkspace/AddMember`, { groupEmail, userEmail });
      return response.data;
    } catch (error) {
      console.error("Error adding to Google group:", error);
      throw error;
    }
  },

  removeMemberFromGroup: async (groupEmail, userEmail) => {
    try {
      const response = await api.post(`/GoogleWorkspace/RemoveMember`, { groupEmail, userEmail });
      return response.data;
    } catch (error) {
      console.error("Error removing from Google group:", error);
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
      const fileName = await postExcelExport(
        api,
        "/Instructor/ExportInstructorListToExcel",
        { username },
        "InstructorList.xlsx"
      );
      return { isSuccess: true, fileName };
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
    downloadExcelBlob(blob, filename);
  },
};

export default instructorService;

