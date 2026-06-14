import api from "./api";
import { postExcelExport } from "../utils/excelExport";

const BASE = "/ReportCard";

const toReportCardId = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    return String(
      value.reportCardId ??
        value.ReportCardId ??
        value.reportCardID ??
        value.ReportCardID ??
        ""
    );
  }
  return String(value);
};

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
    const reportCardId = toReportCardId(request);
    const response = await api.post(`${BASE}/GetScoreDetails`, { reportCardId });
    return response.data;
  },
  getScoreDetailsById: async (scoreId) => {
    const response = await api.get(
      `${BASE}/GetScoreDetails/${encodeURIComponent(toReportCardId(scoreId))}`
    );
    return response.data;
  },
  deleteStudentScore: async (request) => {
    const reportCardId = toReportCardId(request);
    const response = await api.post(`${BASE}/DeleteStudentScore`, { reportCardId });
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
    const response = await api.post(`${BASE}/UpdateStudentScore`, {
      reportID: String(request.reportID ?? request.ReportID ?? ""),
      group: request.group ?? request.Group ?? "",
      examDate: request.examDate ?? request.ExamDate ?? "",
      type: request.type ?? request.Type ?? "",
      totalScore: String(request.totalScore ?? request.TotalScore ?? ""),
      receivedScore: String(request.receivedScore ?? request.ReceivedScore ?? ""),
      comments: request.comments ?? request.Comments ?? "",
    });
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
  uploadScoresFromFile: async ({ file, examDate, group, totalQuizScore, totalClassTestScore, totalHomeWorkScore }) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return reportCardService.importScoresFromExcel({
      ExamDate: examDate,
      Group: group,
      TotalQuizScore: totalQuizScore,
      TotalClassTestScore: totalClassTestScore,
      TotalHomeWorkScore: totalHomeWorkScore,
      FileContent: base64,
      FileName: file.name,
    });
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
