/**
 * Converts AMC_tblLookupSemester Semester code (e.g. S2026, F2025) to display label.
 */
export const formatSemesterLabel = (semesterCode) => {
  if (!semesterCode) {
    return "";
  }

  const code = String(semesterCode).trim();
  const match = code.match(/^([SFsf])(\d{4})$/);
  if (!match) {
    return code;
  }

  const season = match[1].toUpperCase() === "S" ? "Spring" : "Fall";
  return `${season} Semester ${match[2]}`;
};

export const formatRegistrationCloseDate = (value) => {
  if (!value) {
    return "";
  }

  const trimmed = String(value).trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [month, day, year] = trimmed.split("/");
    return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${month}/${day}/${year}`;
};
