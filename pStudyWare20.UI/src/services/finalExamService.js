import api from "./api";

/**
 * Final Exam Service — mirrors legacy FinalExam.aspx API calls.
 * Username is resolved server-side from the JWT; do not send it from the client.
 */
const finalExamService = {
  getStudentList: async () => {
    const response = await api.post("/FinalExam/GetStudentList", {
      mode: "E",
    });
    return response.data;
  },

  getCurrentSession: async (chapterID) => {
    const response = await api.post("/FinalExam/GetCurrentSession", {
      chapterID,
    });
    return response.data;
  },

  getExamQuestions: async (params) => {
    const response = await api.post("/FinalExam/GetExamQuestions", {
      studentID: params.studentID,
      class: params.class,
      examType: params.examType,
      session: params.session,
    });
    return response.data;
  },

  validateScoreUpdate: async (params) => {
    const response = await api.post("/FinalExam/ValidateScoreUpdate", {
      studentID: params.studentID,
      session: params.session,
      class: params.class,
      examType: params.examType,
      source: "OnlineExam",
    });
    return response.data;
  },

  getStudentScores: async () => {
    const response = await api.post("/FinalExam/GetStudentScores", {});
    return response.data;
  },

  getExamAvailability: async () => {
    const response = await api.get("/FinalExam/GetExamAvailability");
    return response.data;
  },

  submitExam: async (examData) => {
    const response = await api.post("/FinalExam/SubmitExam", {
      studentID: examData.studentID,
      class: examData.class,
      examType: examData.examType,
      session: examData.session,
      answers: examData.answers,
      scoreID: examData.scoreID || "0",
    });
    return response.data;
  },
};

export default finalExamService;
