import ExcelJS from "exceljs";

const COLUMNS = [
  { header: "Instructor #", keys: ["InstructorID", "instructorID"], width: 12 },
  { header: "First Name", keys: ["FirstName", "firstName"], width: 16 },
  { header: "Last Name", keys: ["LastName", "lastName"], width: 16 },
  { header: "Chapter", keys: ["ChapterName", "chapterName"], width: 18 },
  { header: "Session", keys: ["Session", "session"], width: 12 },
  { header: "Class", keys: ["Class", "class"], width: 22 },
  { header: "Type", keys: ["InstructorType", "instructorType"], width: 18 },
  { header: "Availability", keys: ["Availability", "availability"], width: 12 },
  { header: "Comments", keys: ["Comments", "comments"], width: 30 },
  { header: "ResponseDate", keys: ["ResponseDate", "responseDate"], width: 20 },
];

const readCell = (row, keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row[key] !== null) return row[key];
  }
  return "";
};

/** Mirrors AMC_spVolunteerAvailability_Summary's `ORDER BY CM.Name, Class, InstructorType`. */
const sortForExport = (rows) => {
  return [...rows].sort((a, b) => {
    const aKey = [readCell(a, ["ChapterName", "chapterName"]), readCell(a, ["Class", "class"]), readCell(a, ["InstructorType", "instructorType"])]
      .join("")
      .toLowerCase();
    const bKey = [readCell(b, ["ChapterName", "chapterName"]), readCell(b, ["Class", "class"]), readCell(b, ["InstructorType", "instructorType"])]
      .join("")
      .toLowerCase();
    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
  });
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportCsv = (rows) => {
  const csvRows = [COLUMNS.map((c) => c.header).join(",")];
  for (const row of rows) {
    const values = COLUMNS.map((c) => {
      const value = readCell(row, c.keys);
      return `"${String(value ?? "").replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }
  const csvContent = "﻿" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, "VolunteerAvailabilityList.csv");
};

const exportExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Volunteer Availability");

  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.header, width: c.width }));
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow(
      COLUMNS.reduce((acc, c) => {
        acc[c.header] = readCell(row, c.keys);
        return acc;
      }, {}),
    );
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, "VolunteerAvailabilityList.xlsx");
};

/** Exports volunteer availability rows as CSV or a modern .xlsx workbook, sorted to match the summary stored procedure. */
export const exportVolunteerAvailability = async (rows, type) => {
  const sorted = sortForExport(rows);
  if (type === "excel") {
    await exportExcel(sorted);
  } else {
    exportCsv(sorted);
  }
};
