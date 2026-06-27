import api from "./api";
import config from "../utils/config";
import { postExcelExport } from "../utils/excelExport";
import { postCsvExport } from "../utils/csvExport";

const BASE = "/StudentWaitingList";

/** DB update + parent/admin emails can exceed the default 10s axios timeout. */
const STUDENT_WAITING_LIST_TIMEOUT = Math.max(
  config.api.timeout || 10000,
  120000,
);

const studentWaitingListService = {
  /**
   * Get student waiting list
   * @param {object} request - { WaitingForOnSite: "N"|"Y", Username: string }
   */
  getStudentWaitingList: async (request) => {
    const response = await api.post(`${BASE}/GetStudentWaitingList`, request, {
      timeout: STUDENT_WAITING_LIST_TIMEOUT,
    });
    return response.data;
  },

  /**
   * Update student waiting list status (approve/decline and set class/session/location)
   * @param {object} request - UpdateStudentWaitingListStatusRequest
   */
  updateStudentWaitingListStatus: async (request) => {
    const response = await api.post(
      `${BASE}/UpdateStudentWaitingListStatus`,
      request,
      { timeout: STUDENT_WAITING_LIST_TIMEOUT },
    );
    return response.data;
  },

  /**
   * Delete student from waiting list
   * @param {object} request - { StudentId: string }
   */
  deleteStudent: async (request) => {
    const response = await api.post(`${BASE}/DeleteStudent`, request, {
      timeout: STUDENT_WAITING_LIST_TIMEOUT,
    });
    return response.data;
  },

  /**
   * Get chapter/location dropdown data
   * @param {object} request - { Mode: "N" }
   */
  getChapterLocation: async (request = { Mode: "N" }) => {
    const response = await api.post(`${BASE}/GetChapterLocation`, request);
    return response.data;
  },

  /**
   * Get password for a user (e.g. for email content)
   * @param {object} request - { EmailId: string }
   */
  getPassword: async (request) => {
    const response = await api.post(`${BASE}/GetPassword`, request);
    return response.data;
  },

  /**
   * Export waiting list to Excel (.xlsx).
   * @param {object} request - { Username: string, WaitingForOnSite?: "N"|"Y" }
   */
  exportToExcel: async (request) => {
    const fileName = await postExcelExport(
      api,
      `${BASE}/ExportToExcel`,
      request,
      "StudentWaitingList.xlsx",
      { timeout: STUDENT_WAITING_LIST_TIMEOUT },
    );
    return { isSuccess: true, fileName };
  },

  /**
   * Export waiting list to CSV.
   * @param {object} request - { Username: string, WaitingForOnSite?: "N"|"Y" }
   */
  exportToCsv: async (request) => {
    const fileName = await postCsvExport(
      api,
      `${BASE}/ExportToCsv`,
      request,
      "StudentWaitingList.csv",
      { timeout: STUDENT_WAITING_LIST_TIMEOUT },
    );
    return { isSuccess: true, fileName };
  },
};

export default studentWaitingListService;
