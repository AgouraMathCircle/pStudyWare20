import api from "./api";

const BASE = "/VolunteerDashboard";

const volunteerDashboardService = {
  /**
   * Full dashboard payload: time sheet rows + aggregates (AMC_spSelectTimeTracking via backend).
   */
  getDashboardData: async (username) => {
    const response = await api.get(`${BASE}/GetDashboardData`, {
      params: username ? { username } : undefined,
    });
    return response.data;
  },

  getTimeTrackingEntries: async (username) => {
    const response = await api.get(`${BASE}/GetTimeTrackingEntries`, {
      params: username ? { username } : undefined,
    });
    return response.data;
  },

  checkPrivileges: async () => {
    const response = await api.get(`${BASE}/CheckVolunteerDashboardPrivileges`);
    return response.data;
  },
};

export default volunteerDashboardService;
