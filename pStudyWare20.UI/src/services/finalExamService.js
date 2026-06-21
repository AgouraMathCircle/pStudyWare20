import api from "./api";

/**
 * Final Exam Service — mirrors legacy FinalExam.aspx API calls.
 */
const finalExamService = {
  getStudentList: async (username) => {
    const response = await api.post("/FinalExam/GetStudentList", {
      username,
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

  getStudentScores: async (username) => {
    const response = await api.post("/FinalExam/GetStudentScores", {
      username,
    });
    return response.data;
  },

  submitExam: async (examData) => {
    const response = await api.post("/FinalExam/SubmitExam", {
      studentID: String(examData.studentID),
      class: examData.class,
      examType: examData.examType,
      session: examData.session,
      answers: (examData.answers || []).map((answer) => ({
        studentID: answer.studentID,
        semester: answer.semester || "",
        class: answer.class,
        question: answer.question,
        answerKey: answer.answerKey,
        points: answer.points ?? 0,
        createdDate: answer.createdDate || new Date().toISOString(),
        examType: answer.examType,
        session: answer.session,
      })),
      scoreID: examData.scoreID || "0",
    });
    return response.data;
  },
};

export default finalExamService;
