/**
 * Shared table + toolbar styles for instructor portal pages
 * (aligned with AdminReportCard /pstudyware/instructor/report-card).
 */

export const INSTRUCTOR_CELL_PADDING = "0 8px";

/** Header cells: no vertical padding (overrides MuiTableCell-sizeSmall). */
export const instructorCellHeaderSx = {
  fontWeight: 400,
  borderRight: "1px solid #4caf50",
  fontSize: "0.75rem",
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 1,
  paddingRight: 1,
  lineHeight: 1.2,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  "& .MuiTableSortLabel-root": {
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: 1.2,
  },
};

export const instructorCellHeaderSxLast = {
  fontWeight: 400,
  fontSize: "0.75rem",
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 1,
  paddingRight: 1,
  lineHeight: 1.2,
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  "& .MuiTableSortLabel-root": {
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: 1.2,
  },
};

export const instructorCellBodySx = {
  borderRight: "1px solid #4caf50",
  fontSize: "0.75rem",
  padding: INSTRUCTOR_CELL_PADDING,
};

export const instructorCellBodySxLast = {
  fontSize: "0.75rem",
  padding: INSTRUCTOR_CELL_PADDING,
};

/** Mui Table — matches report card list tables */
export const instructorTableSx = {
  width: "100%",
  tableLayout: "fixed",
  "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
};

/**
 * Fixed-layout column hints (px) so short headers (View, Video, …) stay word-sized.
 * `null` = share remaining width (Topics, Description, Name).
 * Order: View, Download, Delete, Video, Doc #, Class, Topics, Description, Name, Session, Posted Date, Posted.
 */
export const instructorClassMaterialColWidthsPx = [
  52, 88, 62, 52, 64, 112, null, null, null, 76, 116, 100,
];

/** Instructor student-documents table: Doc #, Description, Type, Document Name, Posted Date, Actions */
export const instructorStudentDocumentsColWidthsPx = [68, null, 76, null, 118, 132];

/**
 * Instructor dashboard My Student List (Actions + 8 data cols).
 * Fixed px for short columns; null = share remaining width.
 */
export const instructorDashboardStudentListColWidthsPx = [
  62, 58, 118, 96, 52, 150, 100, 64, 64,
];

/**
 * Instructor dashboard My Student List: Student #, Name, Class, Grade, School, Parent, Session, Location, Profile
 */
export const instructorStudentListColWidthsPx = [
  80, null, 72, 52, null, null, 88, null, 108,
];

export const instructorTableHeadRowSx = {
  backgroundColor: "#e8f5e8",
  "& .MuiTableCell-head": {
    paddingTop: 0,
    paddingBottom: 0,
  },
};

export const instructorTableBodyRowZebraSx = {
  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
};

/** Green search strip (report card) */
export const instructorGreenSearchBarSx = {
  backgroundColor: "#4caf50",
  p: 0.5,
  borderRadius: 1,
  display: "flex",
  alignItems: "center",
  gap: 1,
  flexWrap: "wrap",
  mb: 0,
};

export const instructorSelectOnGreenSx = {
  color: "white",
  fontSize: "0.75rem",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiSelect-icon": { color: "white" },
};

export const instructorSearchLabelSx = {
  color: "white",
  fontSize: "0.75rem",
  whiteSpace: "nowrap",
};

export const instructorFindButtonSx = {
  backgroundColor: "white",
  color: "#4caf50",
  fontSize: "0.75rem",
  textTransform: "none",
  minHeight: 32,
  py: 0,
  px: 1,
  "&:hover": { backgroundColor: "#f5f5f5" },
};

export const instructorSearchTextFieldSx = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    fontSize: "0.75rem",
  },
};

/** Green pagination footer (report card) */
export const instructorGreenPaginationBarSx = {
  backgroundColor: "#4caf50",
  p: 0.5,
  borderRadius: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1,
};

export const instructorPaginationIconBtnSx = { color: "white", padding: "2px" };

export const instructorPaginationTypographySx = {
  color: "white",
  fontSize: "0.75rem",
};

export const instructorPaginationGoButtonSx = {
  backgroundColor: "white",
  color: "#4caf50",
  fontSize: "0.75rem",
  minHeight: 32,
  py: 0,
  px: 0.75,
  "&:hover": { backgroundColor: "#f5f5f5" },
};

export const instructorPaginationPageSelectSx = {
  color: "white",
  minWidth: 50,
  fontSize: "0.75rem",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiSelect-icon": { color: "white" },
};

export const instructorPaginationGoToTextFieldSx = {
  width: 50,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    fontSize: "0.75rem",
  },
};

/** Page title block (report card) */
export const instructorPageTitleSx = {
  fontWeight: 600,
  color: "#1976d2",
  fontSize: "1rem",
};

/** Dashboard section titles (My Student List, etc.) — blue instructor theme */
export const instructorDashboardSectionTitleSx = {
  fontWeight: 600,
  color: "#1565c0",
  fontSize: "1rem",
};

/** White panel cards on instructor dashboard (matches student dashboard layout) */
export const instructorDashboardPanelCardSx = {
  backgroundColor: "white",
  borderRadius: 2,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  overflow: "hidden",
  boxSizing: "border-box",
  pl: "35px",
  pr: "35px",
  transition: "none !important",
  transform: "none !important",
  marginBottom: "0 !important",
  "&:hover": {
    transform: "none !important",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1) !important",
  },
};

export const instructorDashboardPanelContentSx = {
  px: 1.5,
  pt: 1,
  pb: 0,
  "&:last-child": { pb: 1.5 },
};

/** Dashboard messages panel — slightly tighter bottom than default panel */
export const instructorDashboardMessagesPanelContentSx = {
  px: 1.5,
  pt: 1,
  pb: 0,
  "&:last-child": { pb: 0.75 },
};

/** Meeting Schedule title on instructor dashboard */
export const instructorDashboardMeetingTitleSx = {
  fontWeight: 600,
  color: "#1565c0",
  fontSize: "1rem",
};

/** Min-height only — page background comes from AppLayout + global CSS. */
export const instructorPageShellSx = { minHeight: "100vh" };

/** Space reserved under fixed InstructorHeader so page content is not covered */
export const instructorSubheaderSpacerPx = 42;
