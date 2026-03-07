import api from "./api";

const BASE = "/VolunteersRequest";

const volunteersRequestService = {
  getVolunteersRequest: async (request) => {
    const response = await api.post(`${BASE}/GetVolunteersRequest`, request);
    return response.data;
  },

  updateVolunteerStatus: async (request) => {
    const response = await api.post(`${BASE}/UpdateVolunteerStatus`, request);
    return response.data;
  },

  deleteVolunteerRequest: async (request) => {
    const response = await api.post(`${BASE}/DeleteVolunteerRequest`, request);
    return response.data;
  },

  exportToExcel: async (request) => {
    const response = await api.post(`${BASE}/ExportToExcel`, request);
    return response.data;
  },
};

export default volunteersRequestService;
