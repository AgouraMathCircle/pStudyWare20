/** Site-wide light green surfaces (portal tables, main content, role subheaders). */
import portalBackgroundImg from "../../../assets/images/bg.jpg";

export const APPLICATION_SURFACE_BG = "#e8f5e9";
export const APPLICATION_SURFACE_BORDER = "#c8e6c9";
/** Text / icons on light green bars (navbar, topbar). */
export const APPLICATION_PRIMARY_FG = "#1b5e20";

/** Main heading / list title color on admin portal pages (replaces legacy blue). */
export const APPLICATION_ADMIN_TITLE_COLOR = "#4caf50";

/** CardHeader strip on admin dashboard widgets (To Do, Enrolled Students, etc.). */
export const adminPortalCardHeaderStripSx = {
  backgroundColor: "#e8f5e9",
  color: "#2e7d32",
  padding: 0,
  minHeight: 0,
  "& .MuiCardHeader-content": {
    margin: 0,
    width: "100%",
  },
  "& .MuiCardHeader-title": {
    margin: 0,
    lineHeight: 1.2,
  },
  "& .MuiCardHeader-avatar": {
    color: "#2e7d32",
  },
};

/** Widget card title (To Do List, Enrolled Students, etc.). */
export const adminDashboardWidgetTitleSx = {
  fontSize: "0.9375rem",
  fontWeight: 400,
  color: "#2e7d32",
  lineHeight: 1.2,
};

/** Top-row admin dashboard cards — content height (no stretch gap at bottom). */
export const adminDashboardWidgetCardSx = {
  height: "auto",
  alignSelf: "flex-start",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  boxSizing: "border-box",
  pt: 0,
  px: 0,
  pb: 0,
};

/** Card body fills remaining height below header (pair with adminDashboardWidgetCardSx). */
export const adminDashboardWidgetCardContentSx = {
  flex: "0 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  px: 0,
  pt: 0,
  pb: 0,
  "&:last-child": { pb: 0 },
};

/** Flush card body (System Support / To Do List). */
export const adminDashboardWidgetCardContentFlushSx = {
  flex: "0 1 auto",
  minHeight: 0,
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  px: 0,
  pt: 0,
  pb: 0,
  overflow: "hidden",
  boxSizing: "border-box",
  "&:last-child": { pb: 0 },
};

/** Legacy GridItem / kGrid borders (#54B50A). */
export const ADMIN_DASHBOARD_WIDGET_TABLE_BORDER = "1px solid #54B50A";

/** Bordered count tables (Enrolled Students, Waiting List). */
export const adminDashboardWidgetBorderedTableSx = {
  minWidth: 250,
  borderCollapse: "collapse",
  border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
  "& .MuiTableCell-root": {
    border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
  },
};

/** Compact table cells for dashboard count widgets (Group / OnSite / Online). */
export const adminDashboardWidgetTableCellSx = {
  fontSize: "0.75rem",
  padding: "1px 3px",
  fontWeight: 400,
  lineHeight: 1.2,
  border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
};

/** Table header row only — minimal vertical spacing. */
export const adminDashboardWidgetTableHeaderCellSx = {
  fontSize: "0.75rem",
  padding: "0 3px",
  fontWeight: 400,
  lineHeight: 1.2,
  border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
};

/** To Do user-tracking summary headers (legacy kGrid .kGridHead). */
export const adminDashboardWidgetTrackingHeaderCellSx = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "#043807",
  padding: "2px 4px",
  lineHeight: 1.2,
  background: "linear-gradient(180deg, #8fd14f 0%, #54b50a 100%)",
  borderRight: "1px solid #ffffff",
  borderBottom: "none",
};

/** To Do user-tracking summary body cells — extra compact (legacy kGrid ~200×75). */
export const adminDashboardWidgetTrackingCellSx = {
  fontSize: "0.75rem",
  padding: "1px 4px",
  fontWeight: 400,
  lineHeight: 1.2,
  border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
};

export const adminDashboardWidgetTrackingTableSx = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
  "& .MuiTableCell-root": {
    border: ADMIN_DASHBOARD_WIDGET_TABLE_BORDER,
  },
};

/** Alternating / hover rows for dashboard widget tables and lists. */
export const adminDashboardWidgetTableRowSx = {
  "&:nth-of-type(odd)": {
    backgroundColor: (theme) => theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: (theme) => theme.palette.action.selected,
  },
};

/** List rows for System Support — match Waiting List table row spacing. */
export const adminDashboardWidgetListItemButtonSx = {
  fontSize: "0.75rem",
  py: 0.6,
  px: "3px",
  m: 0,
  minHeight: "unset",
  borderRadius: 0,
  lineHeight: 1.2,
};

export const adminDashboardWidgetListItemTextProps = {
  fontSize: "0.75rem",
  fontWeight: 400,
  lineHeight: 1.2,
};

/** Equal-width column for each dashboard widget card (md+ four-across row). */
export const adminDashboardWidgetColumnSx = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  flex: { md: "1 1 0" },
  minWidth: 0,
  maxWidth: { md: "25%" },
  boxSizing: "border-box",
};

/** AppLayout `<main>` — fills space below nav (avoids min-height 100vh + nav overflow scroll) */
export const applicationMainSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  bgcolor: APPLICATION_SURFACE_BG,
};

/**
 * AppLayout inner shell for authenticated pages: wallpaper + scroll inside main
 * (set `backgroundImage: url(...)` in AppLayout). `/login` stays plain (no wrapper).
 */
export const authenticatedPortalShellSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  overflowY: "auto",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

/** Dashboard / portal page root — same wallpaper as AppLayout authenticated shell. */
export const portalDashboardPageSx = {
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "transparent",
  backgroundImage: `url(${portalBackgroundImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  boxSizing: "border-box",
};

/** Instructor header + dashboard — same horizontal inset as dashboard cards. */
export const instructorPortalContentContainerProps = {
  maxWidth: "xl",
};

/** Spacer height below fixed instructor/admin role header bars. */
export const portalRoleSubheaderSpacerPx = 42;

/** Optional inset panel (e.g. nested cards). */
export const applicationContentPanelSx = {
  bgcolor: APPLICATION_SURFACE_BG,
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
  border: `1px solid ${APPLICATION_SURFACE_BORDER}`,
};

/** Fixed strip under primary Navbar (instructor / admin / student / volunteer). */
export const applicationRoleHeaderBarSx = {
  bgcolor: APPLICATION_SURFACE_BG,
  borderBottom: `2px solid ${APPLICATION_SURFACE_BORDER}`,
  backdropFilter: "blur(8px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

/** Box shadow for portal “white panel” cards (hover override must match). */
export const PORTAL_CARD_BOX_SHADOW = "0 2px 8px rgba(0,0,0,0.1)";

/**
 * Spread into MUI Card `sx` so global `.MuiCard-root:hover` rules
 * (e.g. StudentRegistration.css) do not translate or deepen shadow.
 */
export const portalCardAntiLiftSx = {
  transition: "none !important",
  transform: "none !important",
  marginBottom: "0 !important",
  "&:hover": {
    transform: "none !important",
    boxShadow: `${PORTAL_CARD_BOX_SHADOW} !important`,
  },
};

/** For outer `Paper` shells (e.g. message center) if global CSS adds motion. */
export const portalPaperAntiLiftSx = {
  transition: "none !important",
  transform: "none !important",
  "&:hover": {
    transform: "none !important",
  },
};

/** Current Session Student List / Instructor List — shared panel, table, search, pagination. */
export const ADMIN_SESSION_LIST_BORDER = "1px solid #4caf50";
export const ADMIN_SESSION_LIST_CELL_PADDING = "0 8px";

export const adminSessionListPanelCardSx = {
  backgroundColor: "white",
  borderRadius: 2,
  boxShadow: PORTAL_CARD_BOX_SHADOW,
  overflow: "hidden",
  boxSizing: "border-box",
  pl: "35px",
  pr: "35px",
  ...portalCardAntiLiftSx,
};

export const adminSessionListPanelContentSx = {
  px: 1.5,
  pt: 1.5,
  pb: 0,
  "&:last-child": { pb: 0 },
};

export const adminSessionListHeaderBarSx = {
  mb: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 2,
};

export const adminSessionListTitleSx = {
  fontWeight: 600,
  color: APPLICATION_ADMIN_TITLE_COLOR,
  fontSize: "1rem",
};

/** Red intro / highlight line on student portal list pages (Class Material, Update Score). */
export const studentPortalIntroTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.4,
  color: "red",
};

export const studentPortalLinkSx = {
  color: "#0000ee",
  fontSize: "1.125rem",
  textDecoration: "underline",
};

/** Instruction / body copy on student portal form pages. */
export const studentPortalInstructionTextSx = {
  fontSize: "0.75rem",
  lineHeight: 1.4,
  color: "#333",
  mb: 0.5,
};

export const adminSessionListToolbarButtonSx = {
  fontSize: "0.75rem",
  px: 1.5,
  py: 0.25,
};

/** Fixed height for controls inside green search / pagination bars. */
export const ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT = 32;

const adminSessionListControlBarBaseSx = {
  backgroundColor: "#4caf50",
  py: "4px",
  px: "8px",
  borderRadius: 1,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  minHeight: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT + 8,
  boxSizing: "border-box",
};

export const adminSessionListSearchBarSx = {
  ...adminSessionListControlBarBaseSx,
};

export const adminSessionListSearchLabelSx = {
  color: "white",
  fontSize: "0.75rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
};

export const adminSessionListSearchSelectSx = {
  color: "white",
  fontSize: "0.75rem",
  minWidth: 100,
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiSelect-icon": { color: "white" },
  "& .MuiSelect-select": {
    py: "4px",
    minHeight: "unset !important",
    display: "flex",
    alignItems: "center",
  },
};

export const adminSessionListSearchFieldSx = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    fontSize: "0.75rem",
    height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  },
  "& .MuiOutlinedInput-input": {
    py: 0,
  },
};

export const adminSessionListFindButtonSx = {
  backgroundColor: "white",
  color: "#4caf50",
  fontSize: "0.75rem",
  textTransform: "none",
  minHeight: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  py: 0,
  px: 1,
  lineHeight: 1,
  "&:hover": { backgroundColor: "#f5f5f5" },
};

/** Green header/toolbar action buttons (Upload, Export, Compose, etc.). */
export const portalHeaderActionButtonSx = {
  ...adminSessionListFindButtonSx,
  backgroundColor: "#4caf50",
  color: "white",
  flexShrink: 0,
  px: 1.5,
  "&:hover": { backgroundColor: "#43a047" },
  "& .MuiButton-startIcon": {
    mr: 0.5,
    "& > *:first-of-type": { fontSize: "0.875rem" },
  },
};

export const adminSessionListMenuItemSx = { fontSize: "0.75rem" };

export const adminSessionListTableContainerSx = { width: "100%" };

export const adminSessionListTableSx = {
  width: "100%",
  tableLayout: "fixed",
  "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
};

/** Full green grid borders for Current Session Student List table. */
export const adminSessionListGridTableSx = {
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
  border: ADMIN_SESSION_LIST_BORDER,
  "& .MuiTableCell-root": {
    paddingTop: 0,
    paddingBottom: 0,
    borderRight: ADMIN_SESSION_LIST_BORDER,
    borderBottom: ADMIN_SESSION_LIST_BORDER,
  },
};

export const adminSessionListTableHeadRowSx = {
  backgroundColor: "#e8f5e8",
};

export const adminSessionListTableHeadCellSx = (width, isLast = false) => ({
  fontWeight: 400,
  ...(isLast ? {} : { borderRight: ADMIN_SESSION_LIST_BORDER }),
  width,
  fontSize: "0.75rem",
  padding: ADMIN_SESSION_LIST_CELL_PADDING,
});

export const adminSessionListTableBodyRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
};

export const adminSessionListTableBodyCellSx = ({
  isLast = false,
  ellipsis = false,
  action = false,
} = {}) => ({
  ...(isLast ? {} : { borderRight: ADMIN_SESSION_LIST_BORDER }),
  fontSize: "0.75rem",
  padding: ADMIN_SESSION_LIST_CELL_PADDING,
  ...(action ? { verticalAlign: "middle" } : {}),
  ...(ellipsis
    ? {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    : {}),
});

export const adminSessionListTableActionLinkSx = {
  fontSize: "0.75rem",
  fontWeight: 400,
  color: "#0000ee",
  textDecoration: "underline",
  cursor: "pointer",
  lineHeight: 1.2,
  "&:visited": { color: "#551a8b" },
  "&:hover": { color: "#551a8b" },
};

export const adminSessionListEmptyCellSx = {
  fontSize: "0.75rem",
  padding: ADMIN_SESSION_LIST_CELL_PADDING,
  py: 3,
};

export const adminSessionListEmptyTextSx = { fontSize: "0.75rem" };

export const adminSessionListPaginationBarSx = {
  ...adminSessionListControlBarBaseSx,
  justifyContent: "space-between",
  p: 0,
  py: 0,
  px: 0,
  minHeight: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
};

export const adminSessionListPaginationGroupSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  p: 0,
  m: 0,
};

export const adminSessionListPaginationIconButtonSx = {
  color: "white",
  p: 0,
  width: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
};

export const adminSessionListPaginationTextSx = {
  color: "white",
  fontSize: "0.75rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
  m: 0,
};

export const adminSessionListPaginationSelectSx = {
  color: "white",
  minWidth: 50,
  fontSize: "0.75rem",
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiSelect-icon": { color: "white" },
  "& .MuiSelect-select": {
    py: "4px",
    minHeight: "unset !important",
    display: "flex",
    alignItems: "center",
  },
};

export const adminSessionListPaginationGoFieldSx = {
  width: 50,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    fontSize: "0.75rem",
    height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  },
  "& .MuiOutlinedInput-input": {
    py: 0,
  },
};

export const adminSessionListPaginationGoButtonSx = {
  backgroundColor: "white",
  color: "#4caf50",
  fontSize: "0.75rem",
  minHeight: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  py: 0,
  px: 0.75,
  mr: 1,
  lineHeight: 1,
  "&:hover": { backgroundColor: "#f5f5f5" },
};
