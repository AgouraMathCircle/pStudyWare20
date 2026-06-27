import api from "./api";
import { downloadExcelFromResponse } from "../utils/excelExport";

const BASE = "/UploadAnswerKey";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
        return;
      }
      reject(new Error("Unable to read file."));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const uploadAnswerKeyService = {
  getExamMasterList: async (username) => {
    const response = await api.post(`${BASE}/GetExamMasterList`, { Username: username });
    return response.data;
  },

  deleteExamQuestion: async (questionID) => {
    const response = await api.post(`${BASE}/DeleteExamQuestion`, {
      questionID: String(questionID),
    });
    return response.data;
  },

  downloadExcelTemplate: async () => {
    const response = await api.get(`${BASE}/DownloadExcelTemplate`, {
      responseType: "blob",
    });
    return downloadExcelFromResponse(response, "UpLoadAnswerKey.xlsx");
  },

  uploadAnswerKey: async ({
    username,
    classCode,
    session,
    examType,
    answerType,
    createdBy,
    chapterID,
    file,
  }) => {
    const fileContent = await fileToBase64(file);
    const response = await api.post(`${BASE}/UploadAnswerKey`, {
      username,
      class: classCode,
      session,
      examType,
      answerType,
      createdBy,
      chapterID,
      fileName: file.name,
      fileContent,
    });
    return response.data;
  },
};

export default uploadAnswerKeyService;
