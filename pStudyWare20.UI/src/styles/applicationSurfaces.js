/** Site-wide light green surfaces (portal tables, main content, role subheaders). */
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
  width: "100%",
  minWidth: { xs: 220, sm: 240 },
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
  fontSize: "0.625rem",
  fontWeight: 700,
  color: "#043807",
  padding: "2px 4px",
  lineHeight: 1.2,
  background: "linear-gradient(180deg, #8fd14f 0%, #54b50a 100%)",
  borderRight: "1px solid #ffffff",
  borderBottom: "none",
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

/** Widget grid column — full width on xs, half on sm, quarter on lg+. */
export const adminDashboardWidgetColumnSx = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
};

/** Horizontal scroll wrapper for widget tables on narrow viewports. */
export const adminDashboardWidgetTableScrollSx = {
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
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
