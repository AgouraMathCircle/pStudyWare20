/**
 * Shared MUI sx tokens for portal dialogs (green header, footer bar, form focus).
 * Used by AppConfirmDialog, EmailManager compose/view modal, SentEmail view modal, etc.
 */
import {
  APPLICATION_SURFACE_BG,
  APPLICATION_SURFACE_BORDER,
} from "../styles/applicationSurfaces";

export const PORTAL_MODAL_PRIMARY = "#4caf50";
export const PORTAL_MODAL_PRIMARY_HOVER = "#45a049";
export const PORTAL_MODAL_FG = "#2e7d32";

export const portalModalPaperSx = {
  borderRadius: 2,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  overflow: "hidden",
};

export const portalModalFieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: PORTAL_MODAL_PRIMARY,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: PORTAL_MODAL_FG,
  },
};

export const portalModalSendButtonSx = {
  backgroundColor: PORTAL_MODAL_PRIMARY,
  textTransform: "none",
  fontSize: "0.875rem",
  "&:hover": { backgroundColor: PORTAL_MODAL_PRIMARY_HOVER },
};

export const portalModalClearButtonSx = {
  textTransform: "none",
  fontSize: "0.875rem",
  borderColor: APPLICATION_SURFACE_BORDER,
  color: PORTAL_MODAL_FG,
  "&:hover": {
    borderColor: PORTAL_MODAL_PRIMARY,
    backgroundColor: "rgba(76, 175, 80, 0.04)",
  },
};

export const portalModalActionsSx = {
  px: 3,
  py: 1.5,
  gap: 1,
  bgcolor: APPLICATION_SURFACE_BG,
  borderTop: `1px solid ${APPLICATION_SURFACE_BORDER}`,
};

export const portalModalTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  pr: 1,
  py: 1.25,
  px: 2,
  m: 0,
  bgcolor: PORTAL_MODAL_PRIMARY,
  color: "white",
};

export const portalModalContentSx = {
  px: 3,
  py: 2.5,
  pt: 3.5,
  overflow: "visible",
};

export const portalModalMessageSx = {
  fontSize: "0.875rem",
  color: "#334155",
};

export const portalModalConfirmButtonSx = (color = "primary") => {
  if (color === "error") {
    return {
      backgroundColor: "#d32f2f",
      textTransform: "none",
      fontSize: "0.875rem",
      "&:hover": { backgroundColor: "#c62828" },
    };
  }
  return portalModalSendButtonSx;
};
