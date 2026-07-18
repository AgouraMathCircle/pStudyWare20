/**
 * Legacy StudentScore.aspx.cs RedirectToOnline / OnlineExam.aspx.cs ddlStudentList_SelectedIndexChanged.
 * Dropdown value format: Class~StudentID~ChapterID (legacy Split('~') indices 0, 1, 2).
 *
 * Online exam vs manual Update Score routing uses AMC_tblLookupSemester.OnlineExamDisplayChapter
 * (comma-separated chapter IDs, e.g. "3,5,6,") — configured in Update Lookup Semester admin.
 * When that field is empty, falls back to legacy StudentScore.aspx.cs line 66 (chapter != "2").
 */

/** Legacy manual Update Score chapter when OnlineExamDisplayChapter is not configured. */
export const MANUAL_SCORE_UPDATE_CHAPTER = "2";

export const normalizeChapterId = (chapterId) => {
  const trimmed = String(chapterId ?? "").trim();
  if (!trimmed) return "";
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? trimmed : String(parsed);
};

export const parseStudentDropdownValue = (value) => {
  const parts = String(value || "").split("~");
  if (parts.length >= 3) {
    // Legacy StudentScore.aspx.cs: sStudentinfo[0]=Class, [1]=StudentID, [2]=ChapterID
    return {
      classCode: parts[0] || "",
      studentId: (parts[1] || "").trim(),
      chapterId: normalizeChapterId(parts[2]),
    };
  }
  if (parts.length === 2) {
    return {
      classCode: parts[0] || "",
      studentId: (parts[1] || "").trim(),
      chapterId: "",
    };
  }
  return {
    classCode: "",
    studentId: String(value || "").trim(),
    chapterId: "",
  };
};

/** Parse AMC_tblLookupSemester.OnlineExamDisplayChapter CSV into normalized chapter IDs. */
export const parseOnlineExamDisplayChapters = (onlineExamDisplayChapter) => {
  const raw = String(onlineExamDisplayChapter ?? "").trim();
  if (!raw) return [];

  return raw
    .split(",")
    .map((chapter) => normalizeChapterId(chapter))
    .filter(Boolean);
};

/** True when chapter is listed in OnlineExamDisplayChapter — redirect to Online Exam. */
export const shouldRedirectToOnlineExam = (
  chapterId,
  onlineExamDisplayChapter,
) => {
  const normalized = normalizeChapterId(chapterId);
  if (!normalized) return false;

  const chapters = parseOnlineExamDisplayChapters(onlineExamDisplayChapter);
  if (chapters.length > 0) {
    return chapters.includes(normalized);
  }

  // Legacy pStudyWare/StudentScore.aspx.cs line 66 when DB field is empty
  return normalized !== MANUAL_SCORE_UPDATE_CHAPTER;
};

/** True when chapter is not in OnlineExamDisplayChapter — redirect to manual Update Score. */
export const shouldRedirectToManualScoreUpdate = (
  chapterId,
  onlineExamDisplayChapter,
) => {
  const chapterList = String(onlineExamDisplayChapter ?? "").trim();
  if (!chapterList) return true;

  return !shouldRedirectToOnlineExam(chapterId, onlineExamDisplayChapter);
};

export const getOnlineExamDisplayChapterFromResponse = (response) =>
  response?.onlineExamDisplayChapter ??
  response?.OnlineExamDisplayChapter ??
  "";
export const getStudentListItemText = (student) =>
  student?.text ?? student?.Text ?? "";

export const getStudentListItemValue = (student) =>
  student?.value ?? student?.Value ?? "";

export const getSessionLabel = (session) => {
  if (session == null) return "";
  if (typeof session === "string") return session.trim();
  return String(
    session.session ??
      session.Session ??
      session.currentSession ??
      session.CurrentSession ??
      "",
  ).trim();
};

/** Normalize API session rows; drop blanks. */
export const normalizeSessionRows = (rows) =>
  (rows || [])
    .map((row) => {
      const label = getSessionLabel(row);
      return label ? { session: label } : null;
    })
    .filter(Boolean);

export const ONLINE_EXAM_PATH = "/pstudyware/student/online-exam";
export const FINAL_EXAM_PATH = "/pstudyware/student/final-exam";
export const UPDATE_SCORE_PATH = "/pstudyware/student/update-score";

/** Legacy FinalExam.aspx.cs / OnlineExam.aspx.cs BindQuestions() — 3 columns when count > 10. */
export const splitQuestionsIntoGroups = (questions) => {
  if (!questions?.length) return [[], [], []];
  if (questions.length <= 10) return [questions, [], []];

  const questionCount = questions.length;
  const actualcount =
    questionCount % 3 === 0
      ? Math.floor(questionCount / 3)
      : Math.floor(questionCount / 3) + 1;
  const remainder = questionCount % 3;
  const totalrowCount = remainder === 0 ? actualcount : actualcount + 1;

  return [
    questions.filter((q) => q.question >= 1 && q.question <= totalrowCount),
    questions.filter(
      (q) =>
        q.question >= totalrowCount + 1 &&
        q.question <= totalrowCount + totalrowCount,
    ),
    questions.filter((q) => q.question >= totalrowCount + totalrowCount + 1),
  ];
};

/** @deprecated Use splitQuestionsIntoGroups */
export const splitFinalExamQuestionsIntoGroups = splitQuestionsIntoGroups;

/** Legacy exam submit redirect — FinalExam.aspx / OnlineExam.aspx ?Action=U&ReceivedScore=… */
export const buildExamSubmitSuccessUrl = (basePath, receivedScore, totalScore) => {
  const params = new URLSearchParams();
  params.set("Action", "U");
  params.set("ReceivedScore", String(receivedScore ?? ""));
  params.set("TotalScore", String(totalScore ?? ""));
  return `${basePath}?${params.toString()}`;
};

export const buildFinalExamSubmitSuccessUrl = (receivedScore, totalScore) =>
  buildExamSubmitSuccessUrl(FINAL_EXAM_PATH, receivedScore, totalScore);

export const buildOnlineExamSubmitSuccessUrl = (receivedScore, totalScore) =>
  buildExamSubmitSuccessUrl(ONLINE_EXAM_PATH, receivedScore, totalScore);

/** Legacy exam.aspx.cs divMessage text after successful submit. */
export const formatExamSubmitSuccessMessage = (receivedScore, totalScore) =>
  `You have successfuly submitted. You have received the score : ${receivedScore} out of ${totalScore}.`;

/** @deprecated Use formatExamSubmitSuccessMessage */
export const formatFinalExamSubmitSuccessMessage = formatExamSubmitSuccessMessage;

/** Legacy studentscore.aspx?Student={Text} — encode like ASP.NET (%20 for spaces). */
export const buildUpdateScoreStudentQuery = (studentText) => {
  const name = String(studentText ?? "").trim();
  if (!name) return "";
  return `Student=${encodeURIComponent(name)}`;
};

/** Legacy onLineExam.aspx?Source=S&Action=R&Student=…&ChapterID=… */
export const buildOnlineExamRedirectQuery = ({ studentText, chapterId }) => {
  const parts = ["Source=S", "Action=R"];
  const name = String(studentText ?? "").trim();
  if (name) {
    parts.push(`Student=${encodeURIComponent(name)}`);
  }
  const chapter = normalizeChapterId(chapterId);
  if (chapter) {
    parts.push(`ChapterID=${encodeURIComponent(chapter)}`);
  }
  return parts.join("&");
};

const normalizeStudentName = (name) =>
  decodeURIComponent(String(name || ""))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Match dropdown row by value first, then by display name (legacy uses item.Text). */
export const findStudentListItem = (studentList, { studentValue, studentName } = {}) => {
  if (!studentList?.length) return null;

  const value = String(studentValue || "").trim();
  if (value) {
    const byValue = studentList.find(
      (student) => getStudentListItemValue(student) === value,
    );
    if (byValue) return byValue;
  }

  const normalizedName = normalizeStudentName(studentName);
  if (!normalizedName) return null;

  return (
    studentList.find(
      (student) =>
        normalizeStudentName(getStudentListItemText(student)) === normalizedName,
    ) ||
    studentList.find((student) =>
      normalizeStudentName(getStudentListItemText(student)).includes(normalizedName),
    ) ||
    studentList.find((student) =>
      normalizedName.includes(normalizeStudentName(getStudentListItemText(student))),
    )
  );
};

/** Legacy RedirectToOnline → onLineExam.aspx?Source=S&Action=R&Student=…&ChapterID=… */
export const buildOnlineExamRedirectState = ({
  studentText,
  studentValue,
  chapterId,
}) => ({
  source: "S",
  action: "R",
  student: studentText || "",
  studentValue: studentValue || "",
  chapterID: normalizeChapterId(chapterId),
});

/** Read entry context from React Router state (clean URL) or legacy query string. */
export const getOnlineExamEntryParams = (searchParams, locationState) => {
  const state = locationState || {};
  return {
    action: String(state.action ?? searchParams.get("Action") ?? ""),
    source: String(state.source ?? searchParams.get("Source") ?? ""),
    studentName: String(state.student ?? searchParams.get("Student") ?? ""),
    studentValue: String(state.studentValue ?? ""),
    chapterID: normalizeChapterId(
      state.chapterID ?? searchParams.get("ChapterID") ?? "",
    ),
  };
};

/** True when this row matches the student passed from Update Score redirect (Source=S, Action=R). */
export const isUpdateScoreRedirectEntry = (entry) =>
  entry?.source === "S" && entry?.action === "R";

export const isSameStudentAsUpdateScoreEntry = (
  studentList,
  studentValue,
  entry,
) => {
  if (!isUpdateScoreRedirectEntry(entry)) {
    return false;
  }

  const value = String(studentValue || "").trim();
  if (entry.studentValue && value === entry.studentValue) {
    return true;
  }

  if (!studentList?.length) {
    return false;
  }

  const selected = findStudentListItem(studentList, { studentValue: value });
  const entryStudent = findStudentListItem(studentList, {
    studentValue: entry.studentValue,
    studentName: entry.studentName,
  });

  if (!selected || !entryStudent) {
    return false;
  }

  return (
    getStudentListItemValue(selected) === getStudentListItemValue(entryStudent)
  );
};
