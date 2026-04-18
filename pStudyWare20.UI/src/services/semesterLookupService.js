import api from "./api";

const BASE = "/SemesterLookup";

const semesterLookupService = {
  getSemesterLookup: async (chapterID) => {
    const response = await api.get(`${BASE}/GetSemesterLookup`, {
      params: { chapterID: chapterID ?? "" },
    });
    return response.data;
  },

  updateSemesterLookup: async (payload) => {
    const response = await api.post(`${BASE}/UpdateSemesterLookup`, payload);
    return response.data;
  },
};

export default semesterLookupService;
