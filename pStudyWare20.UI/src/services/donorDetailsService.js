import api from "./api";

const BASE = "/DonorDetails";

const donorDetailsService = {
  checkPrivileges: async () => {
    const response = await api.get(`${BASE}/CheckPrivileges`);
    return response.data;
  },

  getAllDonors: async (forceRefresh = false) => {
    const config = forceRefresh
      ? {
          params: { _t: Date.now() },
          headers: { "Cache-Control": "no-cache" },
        }
      : undefined;
    const response = await api.get(`${BASE}/GetAllDonors`, config);
    return response.data;
  },

  getDonor: async (rowId) => {
    const response = await api.get(`${BASE}/GetDonor/${rowId}`);
    return response.data;
  },

  upsertDonor: async (payload) => {
    const response = await api.post(`${BASE}/UpsertDonor`, payload);
    return response.data;
  },
};

export default donorDetailsService;
