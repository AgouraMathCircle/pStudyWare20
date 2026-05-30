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
  padding: "2px 6px 0",
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

/** Top-row admin dashboard cards: stretch to equal row height. */
export const adminDashboardWidgetCardSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  boxSizing: "border-box",
  pt: 1.5,
  px: 1.5,
  pb: 0,
};

/** Card body fills remaining height below header (pair with adminDashboardWidgetCardSx). */
export const adminDashboardWidgetCardContentSx = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  px: 1,
  pt: 0.75,
  pb: 0,
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
