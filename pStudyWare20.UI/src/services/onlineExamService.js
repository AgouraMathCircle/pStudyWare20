import api from "./api";

/**
 * Online Exam Service
 * Handles all online exam related API calls
 */
const onlineExamService = {
  /**
   * Get list of students for the logged-in user
   * @param {string} username - The username/email of the logged-in user
   * @returns {Promise} API response with student list
   */
  getStudentList: async (username) => {
    try {
      const response = await api.post("/OnlineExam/GetStudentList", {
        username: username,
        type: "E",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching student list:", error);
      throw error;
    }
  },

  /**
   * Get current sessions based on chapter ID
   * @param {string} chapterID - The chapter ID
   * @returns {Promise} API response with session list
   */
  getCurrentSession: async (chapterID) => {
    try {
      const response = await api.post("/OnlineExam/GetCurrentSession", {
        chapterID: chapterID,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current session:", error);
      throw error;
    }
  },

  /**
   * Get online exam questions
   * @param {object} params - Object containing class, examType, session
   * @returns {Promise} API response with exam questions
   */
  getOnlineExamQuestions: async (params) => {
    try {
      const response = await api.post("/OnlineExam/GetOnlineExamQuestions", {
        class: params.class,
        examType: params.examType,
        session: params.session,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching online exam questions:", error);
      throw error;
    }
  },

  /**
   * Validate if score update is enabled for the student
   * @param {object} params - Object containing studentID, session, class, examType
   * @returns {Promise} API response with validation result
   */
  validateScoreUpdate: async (params) => {
    try {
      const response = await api.post("/OnlineExam/ValidateScoreUpdate", {
        studentID: params.studentID,
        session: params.session,
        class: params.class,
        examType: params.examType,
        source: "OnlineExam",
      });
      return response.data;
    } catch (error) {
      console.error("Error validating score update:", error);
      throw error;
    }
  },

  /**
   * Semester lookup routing config (due date + OnlineExamDisplayChapter).
   * @returns {Promise} API response
   */
  getScoreRoutingConfig: async () => {
    try {
      const response = await api.post("/StudentScore/GetDueDate", {});
      return response.data;
    } catch (error) {
      console.error("Error fetching score routing config:", error);
      throw error;
    }
  },

  /**
   * Get student scores
   * @param {string} username - The username/email of the logged-in user
   * @returns {Promise} API response with student scores
   */
  getStudentScores: async (username) => {
    try {
      const response = await api.post("/OnlineExam/GetStudentScores", {
        username: username,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching student scores:", error);
      throw error;
    }
  },

  /**
   * Submit online exam answers
   * @param {object} examData - Object containing studentID, class, examType, session, answers, scoreID
   * @returns {Promise} API response with submission result
   */
  submitOnlineExam: async (examData) => {
    try {
      const response = await api.post("/OnlineExam/SubmitOnlineExam", {
        studentID: examData.studentID,
        class: examData.class,
        examType: examData.examType,
        session: examData.session,
        answers: examData.answers,
        scoreID: examData.scoreID || "0",
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting online exam:", error);
      throw error;
    }
  },
};

export default onlineExamService;
