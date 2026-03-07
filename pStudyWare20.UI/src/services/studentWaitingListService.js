import api from "./api";

const BASE = "/StudentWaitingList";

const studentWaitingListService = {
  /**
   * Get student waiting list
   * @param {object} request - { WaitingForOnSite: "N"|"Y", Username: string }
   */
  getStudentWaitingList: async (request) => {
    const response = await api.post(`${BASE}/GetStudentWaitingList`, request);
    return response.data;
  },

  /**
   * Update student waiting list status (approve/decline and set class/session/location)
   * @param {object} request - UpdateStudentWaitingListStatusRequest
   */
  updateStudentWaitingListStatus: async (request) => {
    const response = await api.post(
      `${BASE}/UpdateStudentWaitingListStatus`,
      request
    );
    return response.data;
  },

  /**
   * Delete student from waiting list
   * @param {object} request - { StudentId: string }
   */
  deleteStudent: async (request) => {
    const response = await api.post(`${BASE}/DeleteStudent`, request);
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
   * Export waiting list to Excel. Returns JSON with FileContent (base64), FileName, ContentType.
   * @param {object} request - { Username: string, Mode?: string }
   */
  exportToExcel: async (request) => {
    const response = await api.post(`${BASE}/ExportToExcel`, request);
    return response.data;
  },
};

export default studentWaitingListService;
