import api from "./api";
import { postExcelExport } from "../utils/excelExport";

/**
 * Service for Registered Student List API calls
 */

/**
 * Get all registered students
 * @param {string} username - Username (optional, will use JWT token if not provided)
 * @param {string} mode - Mode parameter (optional)
 * @returns {Promise} - Promise with student list data
 */
export const getAllRegisteredStudents = async (
  username = null,
  mode = null
) => {
  try {
    const params = {};
    if (username) params.username = username;
    if (mode) params.mode = mode;

    const response = await api.get(
      "/RegisteredStudentList/GetAllRegisteredStudents",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registered students:", error);
    throw error;
  }
};

/**
 * Get registered student list (POST endpoint)
 * @param {Object} request - Request object with username and mode
 * @returns {Promise} - Promise with student list data
 */
export const getRegisteredStudentList = async (request) => {
  try {
    const response = await api.post(
      "/RegisteredStudentList/GetRegisteredStudentList",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching registered student list:", error);
    throw error;
  }
};

/**
 * Get dashboard data for registered student list
 * @param {string} username - Username (optional, will use JWT token if not provided)
 * @returns {Promise} - Promise with dashboard data
 */
export const getDashboardData = async (username = null) => {
  try {
    const params = username ? { username } : {};
    const response = await api.get("/RegisteredStudentList/GetDashboardData", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

/**
 * Get chapter locations
 * @param {string} activeOnly - Active only flag (default: "N")
 * @returns {Promise} - Promise with chapter locations
 */
export const getChapterLocations = async (activeOnly = "N") => {
  try {
    const response = await api.get(
      "/RegisteredStudentList/GetChapterLocations",
      {
        params: { activeOnly },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chapter locations:", error);
    throw error;
  }
};

/**
 * Update student class information
 * @param {Object} request - Update student class request object
 * @returns {Promise} - Promise with update response
 */
export const updateStudentClass = async (request) => {
  try {
    const response = await api.post(
      "/RegisteredStudentList/UpdateStudentClass",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error updating student class:", error);
    throw error;
  }
};

/**
 * Delete student registration
 * @param {string} studentId - Student ID to delete
 * @returns {Promise} - Promise with delete response
 */
export const deleteStudent = async (studentId) => {
  try {
    const response = await api.delete(
      `/RegisteredStudentList/DeleteStudent/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

/**
 * Delete student registration (POST endpoint)
 * @param {Object} request - Delete student request object
 * @returns {Promise} - Promise with delete response
 */
export const deleteStudentPost = async (request) => {
  try {
    const response = await api.post(
      "/RegisteredStudentList/DeleteStudent",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

/**
 * Get student details for update
 * @param {Object} request - Get student for update request object
 * @returns {Promise} - Promise with student details
 */
export const getStudentForUpdate = async (request) => {
  try {
    const response = await api.post(
      "/RegisteredStudentList/GetStudentForUpdate",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student for update:", error);
    throw error;
  }
};

/**
 * Export student list to Excel
 * @param {Object} request - Export Excel request object
 * @returns {Promise} - Promise with file download
 */
export const exportStudentListToExcel = async (request) => {
  try {
    const fileName = await postExcelExport(
      api,
      "/RegisteredStudentList/ExportStudentListToExcel",
      request,
      "StudentList.xlsx"
    );
    return { isSuccess: true, fileName, message: "Excel file downloaded successfully" };
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

/**
 * Handle student action (Edit, Delete)
 * @param {Object} request - Student action request object
 * @returns {Promise} - Promise with action response
 */
export const handleStudentAction = async (request) => {
  try {
    const response = await api.post(
      "/RegisteredStudentList/HandleStudentAction",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error handling student action:", error);
    throw error;
  }
};

/**
 * Check registered student list privileges
 * @returns {Promise} - Promise with privilege status
 */
export const checkRegisteredStudentListPrivileges = async () => {
  try {
    const response = await api.get(
      "/RegisteredStudentList/CheckRegisteredStudentListPrivileges"
    );
    return response.data;
  } catch (error) {
    console.error("Error checking privileges:", error);
    throw error;
  }
};

export default {
  getAllRegisteredStudents,
  getRegisteredStudentList,
  getDashboardData,
  getChapterLocations,
  updateStudentClass,
  deleteStudent,
  deleteStudentPost,
  getStudentForUpdate,
  exportStudentListToExcel,
  handleStudentAction,
  checkRegisteredStudentListPrivileges,
};
