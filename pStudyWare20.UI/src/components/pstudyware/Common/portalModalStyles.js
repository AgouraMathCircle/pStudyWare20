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
  width: "100%",
};

/** Stable grid/form layout inside modals — prevents selects from resizing the dialog. */
export const portalModalFormLayoutSx = {
  width: "100%",
  boxSizing: "border-box",
  "& .MuiGrid-container": {
    width: "100%",
  },
  "& .MuiGrid-container > .MuiGrid-root": {
    minWidth: 0,
    maxWidth: "100%",
  },
  "& .MuiGrid-item": {
    minWidth: 0,
    maxWidth: "100%",
  },
  "& .MuiFormControl-root": {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
  },
};

export const portalModalFieldSx = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  "& .MuiOutlinedInput-root": {
    width: "100%",
    maxWidth: "100%",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: PORTAL_MODAL_PRIMARY,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: PORTAL_MODAL_FG,
  },
  "& .MuiInputBase-input": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .MuiSelect-select": {
    overflow: "hidden !important",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
};

/** Red asterisk on MUI required field labels (legacy ForeColor="Red"). */
export const portalModalRequiredFieldSx = {
  ...portalModalFieldSx,
  "& .MuiFormLabel-asterisk": {
    color: "#d32f2f",
  },
};

export const portalModalSendButtonSx = {
  backgroundColor: PORTAL_MODAL_PRIMARY,
  color: "#FFFFFF",
  textTransform: "none",
  fontSize: "0.875rem",
  "&:hover": { backgroundColor: PORTAL_MODAL_PRIMARY_HOVER },
};

/** Legacy MeetingDetails.aspx .button — dark green Submit. */
export const portalModalLegacySubmitButtonSx = {
  backgroundColor: "#174a10",
  color: "#FFFFFF",
  textTransform: "none",
  fontSize: "0.875rem",
  minWidth: 100,
  minHeight: 25,
  boxShadow: "none",
  "&:hover": { backgroundColor: "#123d0d", boxShadow: "none" },
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

export const portalModalCloseIconButtonSx = {
  color: "white",
  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
};

export const portalModalContentSx = {
  px: 3,
  pb: 2.5,
  // MUI sets padding-top: 0 on DialogContent after DialogTitle — override explicitly.
  pt: "24px !important",
  overflow: "visible",
  width: "100%",
  boxSizing: "border-box",
  ...portalModalFormLayoutSx,
};

/** Pass to MUI Select `MenuProps` — scrollable menu, truncated long option labels. */
export const portalModalSelectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      maxWidth: "min(100vw - 32px, 480px)",
      "& .MuiMenuItem-root": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "block",
      },
    },
  },
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
