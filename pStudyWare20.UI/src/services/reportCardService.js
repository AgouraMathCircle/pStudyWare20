import api from "./api";
import { postExcelExport } from "../utils/excelExport";

const BASE = "/ReportCard";

const reportCardService = {
  getReportCardList: async (request) => {
    const response = await api.post(`${BASE}/GetReportCardList`, request);
    return response.data;
  },
  getAllReportCards: async (username) => {
    const response = await api.get(`${BASE}/GetAllReportCards`, {
      params: { username },
    });
    return response.data;
  },
  getScoreDetails: async (request) => {
    const response = await api.post(`${BASE}/GetScoreDetails`, request);
    return response.data;
  },
  getScoreDetailsById: async (scoreId) => {
    const response = await api.get(`${BASE}/GetScoreDetails/${scoreId}`);
    return response.data;
  },
  deleteStudentScore: async (request) => {
    const response = await api.post(`${BASE}/DeleteStudentScore`, request);
    return response.data;
  },
  deleteScore: async (scoreId) => {
    const response = await api.delete(`${BASE}/DeleteScore/${scoreId}`);
    return response.data;
  },
  addStudentScore: async (request) => {
    const response = await api.post(`${BASE}/AddStudentScore`, request);
    return response.data;
  },
  updateStudentScore: async (request) => {
    const response = await api.post(`${BASE}/UpdateStudentScore`, request);
    return response.data;
  },
  viewReport: async (request) => {
    const response = await api.post(`${BASE}/ViewReport`, request);
    return response.data;
  },
  sendEmail: async (request) => {
    const response = await api.post(`${BASE}/SendEmail`, request);
    return response.data;
  },
  sendStudentReportEmail: async (request) => {
    const response = await api.post(`${BASE}/SendStudentReportEmail`, request);
    return response.data;
  },
  importScoresFromExcel: async (request) => {
    const response = await api.post(`${BASE}/ImportScoresFromExcel`, request);
    return response.data;
  },
  exportToExcel: async (request) => {
    const fileName = await postExcelExport(
      api,
      `${BASE}/ExportToExcel`,
      request,
      "ReportCard.xlsx"
    );
    return { isSuccess: true, fileName };
  },
  getDashboardData: async (username) => {
    const response = await api.get(`${BASE}/GetDashboardData`, {
      params: { username },
    });
    return response.data;
  },
  checkReportCardPrivileges: async () => {
    const response = await api.get(`${BASE}/CheckReportCardPrivileges`);
    return response.data;
  },
  handleScoreAction: async (request) => {
    const response = await api.post(`${BASE}/HandleScoreAction`, request);
    return response.data;
  },
};

export default reportCardService;
