/**
 * Legacy StudentScore.aspx.cs RedirectToOnline / FinalExam.aspx.cs ddlStudentList_SelectedIndexChanged.
 * Dropdown value format: Class~StudentID~ChapterID
 *
 * Redirect chapters come from AMC_tblLookupSemester.OnlineExamDisplayChapter (comma-separated).
 * Fallback matches legacy StudentScore.aspx.cs hard-coded list when lookup is empty.
 */

/** Legacy fallback when OnlineExamDisplayChapter is not configured in semester lookup. */
export const LEGACY_ONLINE_EXAM_REDIRECT_CHAPTERS = new Set(["3", "5", "6"]);

/** Chapter that stays on online exam when changing student (legacy OnlineExam.aspx.cs). */
export const ONLINE_EXAM_STAY_CHAPTER = "6";

export const normalizeChapterId = (chapterId) => {
  const trimmed = String(chapterId ?? "").trim();
  if (!trimmed) return "";
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? trimmed : String(parsed);
};

export const parseStudentDropdownValue = (value) => {
  const parts = String(value || "").split("~");
  if (parts.length >= 3) {
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

/** Parse "1,3,5,6," from AMC_tblLookupSemester.OnlineExamDisplayChapter. */
export const parseOnlineExamDisplayChapters = (raw) => {
  const text = String(raw ?? "").trim();
  if (!text) return null;

  const chapters = new Set();
  text.split(",").forEach((part) => {
    const id = normalizeChapterId(part);
    if (id) {
      chapters.add(id);
    }
  });

  return chapters.size > 0 ? chapters : null;
};

/**
 * StudentScore.aspx.cs RedirectToOnline — redirect when chapter is in configured list.
 * @param {string} chapterId
 * @param {Set<string>|null} configuredChapters from OnlineExamDisplayChapter; null uses legacy fallback
 */
export const shouldRedirectToOnlineExam = (chapterId, configuredChapters = null) => {
  const normalized = normalizeChapterId(chapterId);
  if (!normalized) return false;

  const chapters = configuredChapters ?? LEGACY_ONLINE_EXAM_REDIRECT_CHAPTERS;
  return chapters.has(normalized);
};

/** OnlineExam.aspx.cs — only chapter 6 stays on online exam when student changes. */
export const shouldRedirectToManualScoreUpdate = (chapterId) =>
  normalizeChapterId(chapterId) !== ONLINE_EXAM_STAY_CHAPTER;

export const getStudentListItemText = (student) =>
  student?.text ?? student?.Text ?? "";

export const getStudentListItemValue = (student) =>
  student?.value ?? student?.Value ?? "";
