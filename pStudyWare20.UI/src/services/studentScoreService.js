import api from "./api";
import { STUDENT_SCORE_DEFAULTS } from "../constants/studentScoreDefaults";

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return (
    data?.errorMessage ||
    data?.message ||
    data?.error ||
    data?.title ||
    error?.message ||
    fallback
  );
};

const normalizeScoreValue = (value, defaultValue = "0") =>
  value === "" || value === null || value === undefined ? defaultValue : String(value);

const studentScoreService = {
  getStudentList: async (username) => {
    const response = await api.post("/StudentScore/GetStudentList", {
      username,
      type: "E",
    });
    return response.data;
  },

  getCurrentSession: async (chapterID) => {
    const response = await api.post("/StudentScore/GetCurrentSession", {
      chapterID,
    });
    return response.data;
  },

  validateScoreUpdate: async ({ studentID, session, class: classCode, examType }) => {
    const response = await api.post("/StudentScore/ValidateScoreUpdate", {
      studentID,
      session,
      class: classCode,
      examType: examType || "Quiz",
      source: "UpdateScore",
    });
    return response.data;
  },

  getDueDate: async () => {
    const response = await api.post("/StudentScore/GetDueDate", {});
    return response.data;
  },

  getStudentScores: async (username) => {
    const response = await api.post("/StudentScore/GetStudentScores", {
      username,
    });
    return response.data;
  },

  addStudentScore: async ({
    studentID,
    session,
    class: classCode,
    quizTotalScore,
    quizReceivedScore,
    quizComments,
    classTestTotalScore,
    classTestReceivedScore,
    classTestComments,
    homeWorkTotalScore,
    homeWorkReceivedScore,
    homeWorkComments,
  }) => {
    const response = await api.post("/StudentScore/AddStudentScore", {
      studentID,
      session,
      class: classCode ?? "",
      quizTotalScore: normalizeScoreValue(
        quizTotalScore,
        STUDENT_SCORE_DEFAULTS.quizTotal,
      ),
      quizReceivedScore: normalizeScoreValue(
        quizReceivedScore,
        STUDENT_SCORE_DEFAULTS.receivedEmpty,
      ),
      quizComments: quizComments ?? "",
      classTestTotalScore: normalizeScoreValue(
        classTestTotalScore,
        STUDENT_SCORE_DEFAULTS.classTestTotal,
      ),
      classTestReceivedScore: normalizeScoreValue(
        classTestReceivedScore,
        STUDENT_SCORE_DEFAULTS.receivedEmpty,
      ),
      classTestComments: classTestComments ?? "",
      homeWorkTotalScore: normalizeScoreValue(
        homeWorkTotalScore,
        STUDENT_SCORE_DEFAULTS.homeWorkTotal,
      ),
      homeWorkReceivedScore: normalizeScoreValue(
        homeWorkReceivedScore,
        STUDENT_SCORE_DEFAULTS.receivedEmpty,
      ),
      homeWorkComments: homeWorkComments ?? "",
      finalExamTotalScore: "0",
      finalExamReceivedScore: "0",
      finalExamComments: "",
      placementTestTotalScore: "0",
      placementTestReceivedScore: "0",
      placementTestComments: "",
    });
    return response.data;
  },

  updateStudentScore: async (payload) => {
    const response = await api.post("/StudentScore/UpdateStudentScore", payload);
    return response.data;
  },
};

export { getErrorMessage, normalizeScoreValue };
export default studentScoreService;
