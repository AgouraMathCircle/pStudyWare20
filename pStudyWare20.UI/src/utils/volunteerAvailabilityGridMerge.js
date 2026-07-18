const readRowValue = (row, keys) => {
  if (!row || typeof row !== "object") return "";
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return "";
};

const sameInstructorRow = (row, userID) => {
  const left = String(readRowValue(row, ["InstructorID", "instructorID"])).trim();
  const right = String(userID ?? "").trim();
  return left !== "" && right !== "" && left === right;
};

/** Build a grid row from the saved availability payload. */
export const buildSavedAvailabilityGridRow = (saved, existingRow = null) => {
  const userID = String(saved?.userID ?? "").trim();
  if (!userID) return null;

  const response = String(saved?.response ?? "").trim().toUpperCase();
  const availability = response === "Y" ? "Y" : response === "N" ? "N" : response;
  const responseDate = saved?.responseDate ?? new Date().toISOString();
  const session = String(saved?.session ?? "").trim();
  const comment = String(saved?.comment ?? "").trim();
  const firstName = String(saved?.firstName ?? readRowValue(existingRow, ["FirstName", "firstName"])).trim();
  const lastName = String(saved?.lastName ?? readRowValue(existingRow, ["LastName", "lastName"])).trim();
  const instructorType = String(
    saved?.instructorType ?? readRowValue(existingRow, ["InstructorType", "instructorType"]),
  ).trim();
  const className = String(
    saved?.className ?? readRowValue(existingRow, ["Class", "class"]),
  ).trim();

  return {
    InstructorID: userID,
    instructorID: userID,
    FirstName: firstName,
    firstName,
    LastName: lastName,
    lastName,
    Session: session,
    session,
    Class: className,
    class: className,
    InstructorType: instructorType,
    instructorType,
    Availability: availability,
    availability,
    Comments: comment,
    comments: comment,
    ResponseDate: responseDate,
    responseDate,
  };
};

/** Upsert saved availability into the grid rows without clearing unrelated records. */
export const mergeSavedAvailabilityIntoRows = (existingRows, saved) => {
  const rows = Array.isArray(existingRows) ? [...existingRows] : [];
  const userID = saved?.userID;
  if (!userID) return rows;

  const existingIndex = rows.findIndex((row) => sameInstructorRow(row, userID));
  const existingRow = existingIndex >= 0 ? rows[existingIndex] : null;
  const nextRow = buildSavedAvailabilityGridRow(saved, existingRow);
  if (!nextRow) return rows;

  if (existingIndex >= 0) {
    rows[existingIndex] = { ...existingRow, ...nextRow };
  } else {
    rows.unshift(nextRow);
  }

  return rows;
};

/** Apply post-save refresh payload to current grid rows. Never returns fewer rows solely because summary is empty. */
export const applyVolunteerAvailabilityRefresh = (existingRows, payload) => {
  const summaryData = payload?.summaryData;
  const saved = payload?.saved;

  if (Array.isArray(summaryData) && summaryData.length > 0) {
    return summaryData;
  }

  if (saved?.userID) {
    return mergeSavedAvailabilityIntoRows(existingRows, saved);
  }

  return Array.isArray(existingRows) ? existingRows : [];
};
