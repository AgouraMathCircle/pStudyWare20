import api from "./api";
import { postExcelExport } from "../utils/excelExport";

const BASE = "/VolunteersRequest";

const volunteersRequestService = {
  getVolunteersRequest: async (request) => {
    const response = await api.post(`${BASE}/GetVolunteersRequest`, request);
    return response.data;
  },

  getChapterLocations: async () => {
    const response = await api.get(`${BASE}/GetChapterLocations`);
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
    const fileName = await postExcelExport(
      api,
      `${BASE}/ExportToExcel`,
      request,
      "VolunteersRequest.xlsx"
    );
    return { isSuccess: true, fileName };
  },
};

export default volunteersRequestService;
