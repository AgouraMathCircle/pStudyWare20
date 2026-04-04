import api from "./api";

const BASE = "/TimeSheetTracking";

const timeSheetTrackingService = {
  getTimeSheetTrackingList: async (request) => {
    const response = await api.post(`${BASE}/GetTimeSheetTrackingList`, request);
    return response.data;
  },
  getAllTimeSheetTrackingEntries: async (username) => {
    const response = await api.get(`${BASE}/GetAllTimeSheetTrackingEntries`, {
      params: { username },
    });
    return response.data;
  },
  updateTimeSheetTracking: async (request) => {
    const response = await api.post(`${BASE}/UpdateTimeSheetTracking`, request);
    return response.data;
  },
  deleteTimeSheetTracking: async (request) => {
    const response = await api.post(`${BASE}/DeleteTimeSheetTracking`, request);
    return response.data;
  },
  upsertTimeSheetTracking: async (request) => {
    const response = await api.post(`${BASE}/UpsertTimeSheetTracking`, request);
    return response.data;
  },
  getDashboardData: async (username) => {
    const response = await api.get(`${BASE}/GetDashboardData`, {
      params: { username },
    });
    return response.data;
  },
  checkPrivileges: async () => {
    const response = await api.get(`${BASE}/CheckTimeSheetTrackingPrivileges`);
    return response.data;
  },
  /** Load one entry for edit (volunteer self-service). */
  getTimeSheetForEdit: async (logId, username) => {
    const response = await api.get(`${BASE}/GetTimeSheetTrackingForEdit/${logId}`, {
      params: username ? { username } : undefined,
    });
    return response.data;
  },
  deleteTimeSheetTrackingById: async (logId) => {
    const response = await api.delete(`${BASE}/DeleteTimeSheetTracking/${logId}`);
    return response.data;
  },
};

export default timeSheetTrackingService;
