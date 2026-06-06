import api from "./api";

const BASE = "/VolunteerAvailability";

const volunteerAvailabilityService = {
  getAvailability: async (request) => {
    const response = await api.post(`${BASE}/GetAvailability`, request);
    return response.data;
  },

  updateAvailability: async (request) => {
    const response = await api.post(`${BASE}/UpdateAvailability`, request);
    return response.data;
  },

  getAvailabilitySummary: async (request) => {
    const response = await api.post(`${BASE}/GetAvailabilitySummary`, request);
    return response.data;
  },
};

export default volunteerAvailabilityService;
