/** Legacy StudentScore.aspx default total scores (txtQuiz/ClassTest/HomeWork TotalScore value attributes). */
export const STUDENT_SCORE_DEFAULTS = {
  quizTotal: "5",
  classTestTotal: "15",
  homeWorkTotal: "15",
  receivedEmpty: "0",
};

/**
 * Legacy StudentScore.aspx ddlSession ListItem defaults (Fall/Spring Session 1–10).
 * Used when AMC_spSelectCurrentSession returns no rows (same markup as aspx).
 */
export const LEGACY_SESSION_OPTIONS = [
  ...Array.from({ length: 10 }, (_, i) => `Fall Session ${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `Spring Session ${i + 1}`),
];

export default STUDENT_SCORE_DEFAULTS;
