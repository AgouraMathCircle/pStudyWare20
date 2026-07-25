import api from "./api";

const BASE = "/TimeSheetTracking";

/** Admin self-service calls pass selfOnly so chapter admins only see their own rows. */
const adminSelfServiceParams = (username) => ({
  username,
  selfOnly: true,
});

const adminTimeSheetService = {
  getAllTimeSheetTrackingEntries: async (username) => {
    const response = await api.get(`${BASE}/GetAllTimeSheetTrackingEntries`, {
      params: adminSelfServiceParams(username),
    });
    return response.data;
  },

  getTimeSheetForEdit: async (logId, username) => {
    const response = await api.get(`${BASE}/GetTimeSheetTrackingForEdit/${logId}`, {
      params: adminSelfServiceParams(username),
    });
    return response.data;
  },

  upsertTimeSheetTracking: async (request) => {
    const response = await api.post(`${BASE}/UpsertTimeSheetTracking`, request);
    return response.data;
  },

  deleteTimeSheetTrackingById: async (logId) => {
    const response = await api.post(`${BASE}/DeleteTimeSheetTracking`, {
      logID: Number(logId),
    });
    return response.data;
  },
};

export default adminTimeSheetService;
