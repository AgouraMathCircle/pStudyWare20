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
    const logId = Number(request?.logID ?? request?.LogID);
    if (!Number.isFinite(logId) || logId <= 0) {
      throw new Error("A valid log ID is required to delete this entry.");
    }
    const response = await api.post(`${BASE}/DeleteTimeSheetTracking`, { logID: logId });
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
