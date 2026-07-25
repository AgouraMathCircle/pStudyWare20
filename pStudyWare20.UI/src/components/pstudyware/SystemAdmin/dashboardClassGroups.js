/** Class groups shown on System Admin dashboard count widgets (legacy Admin_Dashboard.aspx). */
export const DASHBOARD_CLASS_GROUPS = [
  { key: "JB", label: "Junior Beginner" },
  { key: "JI", label: "Junior Intermediate" },
  { key: "JA", label: "Junior Advanced" },
  { key: "SB", label: "Senior Beginner" },
  { key: "SI", label: "Senior Intermediate" },
  { key: "SA", label: "Senior Advanced" },
  { key: "AT", label: "ACT Training" },
  { key: "ST", label: "PSAT Training" },
  { key: "AI", label: "Artificial Intelligence" },
  { key: "GD", label: "Game Development" },
  { key: "ED", label: "Engineering Design" },
  { key: "DS", label: "Data Science" },
  { key: "AD", label: "App Development" },
];

export const getEnrolledCountKeys = (classKey) => ({
  onsiteKey: `onstudentCnt${classKey}`,
  onlineKey: `instudentCnt${classKey}`,
});

export const getWaitingCountKeys = (classKey) => ({
  onsiteKey: `onwaitingCnt${classKey}`,
  onlineKey: `inwaitingCnt${classKey}`,
});
