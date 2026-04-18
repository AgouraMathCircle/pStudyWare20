import api from "./api";

const BASE = "/InstructorDashboard";

const instructorDashboardService = {
  /**
   * Dashboard payload: student rows + summary (AMC_spSelectStudentList + metadata).
   */
  getDashboardData: async (username) => {
    const response = await api.get(`${BASE}/GetDashboardData`, {
      params: username ? { username } : undefined,
    });
    return response.data;
  },

  /**
   * Student list only (POST; username optional — JWT used when omitted).
   */
  getStudentList: async (username) => {
    const response = await api.post(`${BASE}/GetStudentList`, {
      username: username || "",
    });
    return response.data;
  },

  checkInstructorPrivileges: async () => {
    const response = await api.get(`${BASE}/CheckInstructorPrivileges`);
    return response.data;
  },
};

export default instructorDashboardService;
