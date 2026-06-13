import api from "./api";
import { postExcelExport } from "../utils/excelExport";

const BASE = "/SpecialEventsRegistration";

const specialEventsRegistrationService = {
  getSpecialEventsRegistrationList: async (request) => {
    const response = await api.post(
      `${BASE}/GetSpecialEventsRegistrationList`,
      request
    );
    return response.data;
  },
  getAllSpecialEventsRegistrations: async (username) => {
    const response = await api.get(`${BASE}/GetAllSpecialEventsRegistrations`, {
      params: { username },
    });
    return response.data;
  },
  deleteSpecialEventsRegistration: async (request) => {
    const response = await api.post(
      `${BASE}/DeleteSpecialEventsRegistration`,
      request
    );
    return response.data;
  },
  exportToExcel: async (request) => {
    const fileName = await postExcelExport(
      api,
      `${BASE}/ExportSpecialEventsRegistrationToExcel`,
      request,
      "SpecialEventsRegistration.xlsx"
    );
    return { isSuccess: true, fileName };
  },
  getDashboardData: async (username) => {
    const response = await api.get(`${BASE}/GetDashboardData`, {
      params: { username },
    });
    return response.data;
  },
  checkPrivileges: async () => {
    const response = await api.get(
      `${BASE}/CheckSpecialEventsRegistrationPrivileges`
    );
    return response.data;
  },
};

export default specialEventsRegistrationService;
