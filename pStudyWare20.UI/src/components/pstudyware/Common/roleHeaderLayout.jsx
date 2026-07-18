import { useCallback, useLayoutEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { applicationRoleHeaderBarSx } from "../styles/applicationSurfaces";

export const PORTAL_NAVBAR_BOTTOM_VAR = "--portal-navbar-bottom";

export const ROLE_HEADER_HEIGHT_VARS = {
  admin: "--admin-role-header-height",
  student: "--student-role-header-height",
  instructor: "--instructor-role-header-height",
  volunteer: "--volunteer-role-header-height",
};

export function createRoleHeaderSpacer(heightVar, className, fallbackPx = 30) {
  // Sticky role headers stay in document flow; spacer is a small visual gap only.
  const RoleHeaderSpacer = () => (
    <Box
      className={className}
      sx={{
        height: 8,
        flexShrink: 0,
        scrollMarginTop: `calc(var(${PORTAL_NAVBAR_BOTTOM_VAR}, 32px) + var(${heightVar}, ${fallbackPx}px))`,
      }}
      aria-hidden
    />
  );
  return RoleHeaderSpacer;
}

export const AdminRoleHeaderSpacer = createRoleHeaderSpacer(
  ROLE_HEADER_HEIGHT_VARS.admin,
  "admin-role-header-spacer",
  30,
);

export const StudentRoleHeaderSpacer = createRoleHeaderSpacer(
  ROLE_HEADER_HEIGHT_VARS.student,
  "student-role-header-spacer",
  30,
);

export const InstructorRoleHeaderSpacer = createRoleHeaderSpacer(
  ROLE_HEADER_HEIGHT_VARS.instructor,
  "instructor-role-header-spacer",
  30,
);

export const VolunteerRoleHeaderSpacer = createRoleHeaderSpacer(
  ROLE_HEADER_HEIGHT_VARS.volunteer,
  "volunteer-role-header-spacer",
  30,
);

export function compactRoleHeaderBarSx(borderBottomColor) {
  return {
    ...applicationRoleHeaderBarSx,
    borderBottom: `1px solid ${borderBottomColor}`,
    borderTop: "none",
    boxShadow: "none",
    pt: 0,
    pb: 0,
    mt: 0,
    marginTop: 0,
  };
}

export function publishPortalNavbarBottom(element) {
  if (!element) return;
  // Use offsetHeight because the Navbar sticks to top: 0,
  // so its bottom boundary when sticky is exactly its height.
  const height = element.offsetHeight || 32;
  document.documentElement.style.setProperty(
    PORTAL_NAVBAR_BOTTOM_VAR,
    `${height}px`,
  );
}

export function clearPortalNavbarBottom() {
  document.documentElement.style.removeProperty(PORTAL_NAVBAR_BOTTOM_VAR);
}

/** Sticky role header position — perfectly stacks under portal navbar via CSS variable. */
export function fixedRoleHeaderPositionSx(theme) {
  return {
    position: "sticky",
    top: `var(${PORTAL_NAVBAR_BOTTOM_VAR}, 32px)`,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar - 1,
    width: "100%",
    mt: 0,
    marginTop: 0,
  };
}

/** Publishes role header height CSS variable for page spacers. */
export function useFixedRoleHeaderLayout(headerRef, heightVar, refreshKeys = []) {
  const theme = useTheme();

  const publishHeaderHeight = useCallback(() => {
    if (!headerRef.current) return;
    const height = Math.ceil(headerRef.current.getBoundingClientRect().height);
    document.documentElement.style.setProperty(heightVar, `${height}px`);
  }, [heightVar, headerRef]);

  useLayoutEffect(() => {
    publishHeaderHeight();
    window.addEventListener("resize", publishHeaderHeight);

    let resizeObserver;
    if (headerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(publishHeaderHeight);
      resizeObserver.observe(headerRef.current);
    }

    const t1 = window.setTimeout(publishHeaderHeight, 0);
    const t2 = window.setTimeout(publishHeaderHeight, 150);
    return () => {
      window.removeEventListener("resize", publishHeaderHeight);
      resizeObserver?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishHeaderHeight, ...refreshKeys]);

  return { theme, fixedSx: fixedRoleHeaderPositionSx(theme) };
}
